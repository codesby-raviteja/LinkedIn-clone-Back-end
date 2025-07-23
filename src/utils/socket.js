import { Server, Socket } from "socket.io";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("socket connected =>", socket.id);



    socket.on("disconnect", (reson) => {
      console.log(`${socket.id} got disconnected`);
    });
  });
  return io
};

export default initializeSocket;
