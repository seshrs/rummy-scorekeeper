import { Socket } from 'socket.io';

type JoinRoomAckType = {
  role: 'scorekeeper' | 'viewer';
};

const roomIdToAdminSocketId: { [roomId: string]: string } = {};

const SOCKET_ROOM_PREFIX = 'rummy-room-';

export default function handleIncomingConnection(socket: Socket) {
  console.log('@@@ received connection from sock id', socket.id);

  socket.on(
    'setRoomId',
    (roomId: string, ack: (msg: JoinRoomAckType) => void) => {
      console.log('Socket ', socket.id, ' requests to join room ID ', roomId);

      if (socket.rooms.size > 1) {
        // Need to leave any previous room
        const roomsToLeave = [...socket.rooms.keys()].filter((room) =>
          room.startsWith(SOCKET_ROOM_PREFIX),
        );
        console.log('  leaving rooms: ', roomsToLeave);
        roomsToLeave.forEach((oldRoomId) => leaveRoom(socket, oldRoomId));
      }

      const mangledRoomId = `${SOCKET_ROOM_PREFIX}${roomId}`;
      socket.join(mangledRoomId);

      if (roomIdToAdminSocketId[mangledRoomId]) {
        // There's currently an admin, so make this socket a viewer
        ack({ role: 'viewer' });
        console.log('  joined room as viewer');
      } else {
        // Set this socket as the room's admin
        roomIdToAdminSocketId[mangledRoomId] = socket.id;
        ack({ role: 'scorekeeper' });
        console.log('  joined room as scorekeeper');
      }
    },
  );

  socket.on('setGameState', (...args: any[]) => {
    forwardEvent(socket, 'setGameState', ...args);
  });
  socket.on('setClaimsForCurrentRound', (...args: any[]) => {
    forwardEvent(socket, 'setClaimsForCurrentRound', ...args);
  });
  socket.on('setPlayerScoreForCurrentRound', (...args: any[]) => {
    forwardEvent(socket, 'setPlayerScoreForCurrentRound', ...args);
  });
  socket.on('startNextRound', (...args: any[]) => {
    forwardEvent(socket, 'startNextRound', ...args);
  });
}

function leaveRoom(socket: Socket, roomId: string) {
  socket.leave(roomId);
  if (roomIdToAdminSocketId[roomId] === socket.id) {
    delete roomIdToAdminSocketId[roomId];
  }
}

function getRoomId(socket: Socket) {
  const rummyRooms = [...socket.rooms.keys()].filter((room) =>
    room.startsWith(SOCKET_ROOM_PREFIX),
  );
  if (rummyRooms.length !== 1) {
    throw new Error('getRoomId expected socket to only be in one room');
  }
  return rummyRooms[0];
}

function forwardEvent(socket: Socket, event: string, ...args: any[]) {
  console.log('Socket ', socket.id, ' with args ', args);

  // Verify that this socket is the admin of its room
  const roomId = getRoomId(socket);
  if (!roomIdToAdminSocketId[roomId]) {
    console.log('  ignoring request since not scorekeeper');
    return;
  }

  socket.to(`${roomId}`).emit(event, ...args);
  console.log('  emitted to the room');
}
