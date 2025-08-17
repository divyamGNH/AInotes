import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const Settings = () => {
  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        transports: ["websocket"],
        withCredentials: true,
      }),
    []
  );

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  // send message
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // if no room entered → will be sent to everyone
    socket.emit("message", { message, room: room.trim() || null });
    setMessage("");
  };

  // join a room
  const joinRoomHandler = (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    socket.emit("join-room", roomName.trim());
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected:", socket.id);
    });

    socket.on("receive-message", (data) => {
      console.log("Received:", data);
      setMessages((messages) => [...messages, data]);
    });

    // clean up listeners on unmount (don’t disconnect)
    return () => {
      socket.off("connect");
      socket.off("receive-message");
    };
  }, [socket]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 100 }} />
      <Typography variant="h6" gutterBottom>
        Socket ID: {socketID}
      </Typography>

      {/* Join Room */}
      <form onSubmit={joinRoomHandler} style={{ marginBottom: "20px" }}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          label="Room Name"
          variant="outlined"
          size="small"
          sx={{ marginRight: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>

      {/* Send Message */}
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          label="Message"
          variant="outlined"
          size="small"
          sx={{ marginRight: 2 }}
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          label="Room (leave empty for global)"
          variant="outlined"
          size="small"
          sx={{ marginRight: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      {/* Message List */}
      <Stack sx={{ marginTop: 3 }}>
        {messages.map((m, i) => (
          <Typography key={i} variant="body1" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default Settings;
