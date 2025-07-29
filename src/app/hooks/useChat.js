import { useEffect, useRef, useState } from "react";
import { initSocket } from "../services/socket";

export default function useChat(user, roomID) {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    // لا تنشئ اتصال إلا إذا كان المستخدم موجود وغرفة صحيحة
    if (!user || !roomID.trim()) return;

    const token = localStorage.getItem("token");
    socketRef.current = initSocket(token);

    socketRef.current.on("connect", () => {
      console.log("Connected");
    });

    socketRef.current.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      if (socketRef.current && roomID) {
        socketRef.current.emit("leaveRoom", roomID);
        socketRef.current.off("message");
        socketRef.current.disconnect();
      }
    };
  }, [user, roomID]);

  const sendMessage = (text) => {
    if (text.trim() && socketRef.current) {
      socketRef.current.emit("message", { room: roomID, text });
    }
  };

  const joinRoom = () => {
    if (roomID.trim() && socketRef.current) {
      socketRef.current.emit("joinRoom", roomID);
      setMessages([]); // نظف الرسائل عند دخول غرفة جديدة
      setJoined(true);
    }
  };

  return { messages, sendMessage, joinRoom, joined };
}
