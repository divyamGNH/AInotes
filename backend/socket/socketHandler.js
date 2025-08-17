export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User is connected:", socket.id);

    socket.on("message", ({ room, message }) => {
      console.log({ room, message });

      if (room && room.trim() !== "") {
        // Send only to that room
        socket.to(room).emit("receive-message", message);
      } else {
        // If no room specified → broadcast to everyone
        io.emit("receive-message", message);
      }
    });

    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });
};
