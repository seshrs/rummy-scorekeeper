import { Socket } from 'socket.io';

type JoinRoomAckType = {
  role: 'scorekeeper' | 'viewer';
};

const roomIdToAdminSocketId: { [roomId: string]: string } = {};

const SOCKET_ROOM_PREFIX = 'rummy-room-';

export default function handleIncomingConnection(socket: Socket) {
  socket.on(
    'setRoomId',
    (roomId: string, ack: (msg: JoinRoomAckType) => void) => {
      console.log('Socket ', socket.id, ' requests to join room ID ', roomId);

      if (socket.rooms.size > 2) {
        // Need to leave any previous room
        const roomsToLeave = [...socket.rooms.keys()].filter((room) =>
          room.startsWith(SOCKET_ROOM_PREFIX),
        );
        console.log('  leaving rooms: ', roomsToLeave);
        roomsToLeave.forEach((oldRoomId) => leaveRoom(socket, oldRoomId));
      }

      socket.join(`${SOCKET_ROOM_PREFIX}${roomId}`);

      if (roomIdToAdminSocketId[roomId]) {
        // There's currently an admin, so make this socket a viewer
        ack({ role: 'viewer' });
        console.log('  joined room as viewer');
      } else {
        // Set this socket as the room's admin
        roomIdToAdminSocketId[roomId] = socket.id;
        ack({ role: 'scorekeeper' });
        console.log('  joined room as scorekeeper');
      }
    },
  );
}

function leaveRoom(socket: Socket, roomId: string) {
  socket.leave(roomId);
  if (roomIdToAdminSocketId[roomId] === socket.id) {
    delete roomIdToAdminSocketId[roomId];
  }
}
