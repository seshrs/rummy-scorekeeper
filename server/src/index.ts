import express from 'express';
import path from 'path';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

import handleIncomingConnection from './handleIncomingConnection';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);
const PORT = 3001;
const HEARTBEAT_INTERVAL = 45e3;

const clientDir = path.join(__dirname, '../../client/build');
app.use(express.static(clientDir));
// Serve rules page directly
app.get('/rules/', function (req, res) {
  res.sendFile(path.join(clientDir, 'rules.html'));
});
app.get('/*', function (req, res) {
  res.sendFile(path.join(clientDir, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

io.on('connection', handleIncomingConnection);

// Keep sockets alive. Based on this suggestion:
// https://github.com/socketio/socket.io/issues/2924#issuecomment-298694322
setInterval(() => {
  io.emit('heartbeat:ping');
}, HEARTBEAT_INTERVAL);
