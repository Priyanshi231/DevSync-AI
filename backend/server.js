import "dotenv/config";

import http from 'http';
import app from './app.js';
import connectDB from './db/db.js';
import {Server} from 'socket.io';
 
connectDB();

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', socket => {

  console.log('a user connected');

  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { /* … */ });
});


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

