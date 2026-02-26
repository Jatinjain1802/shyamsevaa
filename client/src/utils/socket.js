import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:7484";

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export default socket;
