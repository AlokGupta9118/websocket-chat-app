// client/src/App.js (Updated for Modern UI with Features)
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("https://websocket-chat-server-zhe9.onrender.com");

function App() {
  const [username, setUsername] = useState("");
  const [entered, setEntered] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    socket.on("user typing", (user) => {
      if (user !== username) {
        setTypingUser(user);
        setTimeout(() => setTypingUser(null), 1500);
      }
    });

    socket.on("user count", (count) => {
      setOnlineUsers(count);
    });

    socket.on("user joined", (user) => {
      setChat((prev) => [...prev, { user: "System", text: `${user} joined the chat!`, system: true }]);
    });

    socket.on("user left", (user) => {
      setChat((prev) => [...prev, { user: "System", text: `${user} left the chat.`, system: true }]);
    });

    return () => {
      socket.off("chat message");
      socket.off("user typing");
      socket.off("user count");
      socket.off("user joined");
      socket.off("user left");
    };
  }, [username]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const getTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes().toString().padStart(2, "0");
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const time = getTime();
      socket.emit("chat message", {
        user: username,
        text: message,
        time,
      });
      setMessage("");
    }
  };

  const handleTyping = () => {
    socket.emit("user typing", username);
  };

  const handleEnterChat = () => {
    if (username.trim()) {
      setEntered(true);
      socket.emit("user joined", username);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const themeClass = darkMode ? "dark" : "";

  return (
    <div className={`app-container ${themeClass}`}>
      {!entered ? (
        <div className="enter-screen">
          <h2>👋 Enter Your Name</h2>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name..."
          />
          <button onClick={handleEnterChat}>Join Chat</button>
        </div>
      ) : (
        <div className="chat-wrapper">
          <div className="chat-header">
            <h2>💬 Chat Room</h2>
            <div className="status-bar">
              <span className="online-users">🟢 {onlineUsers} online</span>
              <button onClick={toggleDarkMode} className="dark-toggle">
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>
            </div>
          </div>

          <div className="chat-box">
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${
                  msg.system ? "system-msg" : msg.user === username ? "own" : "other"
                } fade-in`}
              >
                {!msg.system && (
                  <div className="bubble-header">
                    <span className="username">{msg.user === username ? "You" : msg.user}</span>
                    <span className="time">{msg.time}</span>
                  </div>
                )}
                <div className="bubble-text">{msg.text}</div>
              </div>
            ))}
            {typingUser && <div className="typing">✍️ {typingUser} is typing...</div>}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleTyping}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
