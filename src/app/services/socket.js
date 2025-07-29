import { io } from "socket.io-client";

let socket;

export const initSocket = (token) => {
  socket = io("https://quizarenasocket.onrender.com", {
    auth: { token },
  });
  return socket;
};

export const getSocket = () => socket;
