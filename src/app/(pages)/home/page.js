"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import useUserStore from "../../../../store/userStore";
import useChat from "@/app/hooks/useChat";

export default function ChatPage() {
  const { user, logout } = useUserStore(); // تأكد أن لديك دالة logout في userStore
  const router = useRouter();
  const [roomID, setRoomID] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // استخدام hook الدردشة
  const { messages, sendMessage, joinRoom, joined } = useChat(user, roomID);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const handleSend = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatHeader}>
        <div className={styles.headerRow}>
          <h1>Welcome, {user?.userName}</h1>
          <button className={styles.logoutButton} onClick={handleLogout}>
            تسجيل خروج
          </button>
        </div>
        <p>{joined && roomID ? `Room ID: ${roomID}` : ""}</p>
      </div>

      <div className={styles.messageArea}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.sender === user._id ? styles.sent : ""
            }`}
          >
            {msg.text}
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
            <button onClick={joinRoom} className={styles.sendButton}>
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
            <button onClick={handleSend} className={styles.sendButton}>
              Send
            </button>
          </>
        )}
      </div>
    </div>
  );
}
