import "dotenv/config";

import http from 'http';
import app from './app.js';
import connectDB from './db/db.js';

connectDB();

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

