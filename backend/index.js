const io = require("socket.io")(80, {
    cors: {
      origin: "*", // Allow connections from any origin
      methods: ["GET", "POST"]
    }
  });
  
  const users = {};
  
  io.on("connection", (socket) => {
    console.log("A user connected");
  
    // Handle new user joining with name and lobby code (listen for 'join-room' event)
    socket.on("join-room", ({ name, room }) => {
      users[socket.id] = { name, room };
  
      // Add the user to the room (lobby)
      socket.join(room);
  
      io.to(room).emit("user-connected", name);
      console.log(`User ${name} connected to lobby ${room}`);
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      const user = users[socket.id];
      if (user) {
        // Broadcast to the room (lobby) that the user disconnected
        socket.to(user.room).emit('user-disconnected', user.name);
  
        // Remove the user from the users object
        delete users[socket.id];
      }
    });
  
    // Handle updated array from a user
    socket.on("update-array", (newArray) => {
      // Emit updated array to everyone in the room (lobby)
      console.log("na", newArray)
      const user = users[socket.id];
      if (user) {
        io.to(user.room).emit("update-array", newArray);

      }
      console.log(newArray);
    });
  
    // Handle chat messages
    socket.on('send-chat-message', (message) => {
      const user = users[socket.id];
      if (user) {
        // Broadcast message to the specific room (lobby)
        socket.to(user.room).emit('chat-message', { message: message.message, name: user.name });
      }
    });
  });
  
  console.log("WebSocket server running on port 3002");
  