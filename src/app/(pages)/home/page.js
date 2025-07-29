"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import useUserStore from "../../../../store/userStore";
import { io } from "socket.io-client";

export default function ChatPage() {
  const [joined, setJoined] = useState(false);
  const { user } = useUserStore();
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomID, setRoomID] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const token = localStorage.getItem("token");

    // تهيئة الاتصال داخل useEffect
    socketRef.current = io("http://localhost:8080", {
      auth: { token },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to server");
    });

    socketRef.current.on("message", (msg) => {
      setMessages((prev) => [...prev, { text: msg.text, sender: msg.sender }]);
    });

    return () => {
      socketRef.current.off("message");
      socketRef.current.emit("leaveRoom", roomID);
      socketRef.current.disconnect();
    };
  }, [user, router, roomID]);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socketRef.current.emit("message", {
        room: roomID,
        text: newMessage,
      });
      setMessages((prev) => [...prev, { text: newMessage, sender: "user" }]);
      setNewMessage("");
    }
  };

  const JoinRoom = () => {
    if (roomID.trim() !== "") {
      socketRef.current.emit("joinRoom", roomID);
      setJoined(true); // ✅ المستخدم الآن داخل الغرفة
      console.log(`Joined room: ${roomID}`);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.chatHeader}>
        <h1>Welcome, {user?.userName}</h1>
      </div>
      <div className={styles.messageArea}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              message.sender === "user" ? styles.sent : ""
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className={styles.inputArea}>
        {!joined ? (
          <>
            <input
              type="text"
              className={styles.inputField}
              value={roomID}
              onChange={(e) => setRoomID(e.target.value)}
              placeholder="Enter Room ID..."
            />
            <button onClick={JoinRoom} className={styles.sendButton}>
              Join Room
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              className={styles.inputField}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage} className={styles.sendButton}>
              Send
            </button>
          </>
        )}
      </div>
    </div>
  );
}
