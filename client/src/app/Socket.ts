import io from 'socket.io-client';

const socket = io();

export function joinRoom(
  roomId: string,
): Promise<{ roomId: string; role: ClientRole }> {
  return new Promise((resolve) => {
    socket.emit('setRoomId', roomId, (role: ClientRole) => {
      console.log('received client role from server', { roomId, role });
      resolve({ roomId, role });
    });
  });
}

export default socket;
