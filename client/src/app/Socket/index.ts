import io from 'socket.io-client';

import registerListeners from './listeners';

const socket = io();
registerListeners(socket);

export default socket;
