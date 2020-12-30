import express from 'express';
import path from 'path';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function dbTest() {
  const allUsers = prisma.user.findMany();
  (await allUsers).forEach((user) => console.log(user));
}

dbTest()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import handleIncomingConnection from './handleIncomingConnection';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);
const PORT = process.env.port || 3001;

const clientDir = path.join(__dirname, '../../client/build');
app.use(express.static(clientDir));

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

io.on('connection', handleIncomingConnection);
