// client/src/App.js
import React, { useEffect, useRef, useState } from "react";
import './App.css';
import { io } from "socket.io-client";

// Your Render backend URL
const socket = io("https://websocket-chat-server-zhe9.onrender.com");

socket.on("connect", () => {
  console.log("Connected to server");
});

function App() {
  const [username, setUsername] = useState("");
  const [entered, setEntered] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => socket.off("chat message");
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // ✅ Time Formatter Without Seconds
  const getTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes().toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const formattedTime = getTime();
      console.log("Formatted time:", formattedTime); // Debug

      socket.emit("chat message", {
        user: username,
        text: message,
        time: formattedTime,
      });
      setMessage("");
    }
  };

  const handleEnterChat = () => {
    if (username.trim()) setEntered(true);
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
            <button onClick={toggleDarkMode} className="dark-toggle">
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>

          <div className="chat-box">
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${msg.user === username ? "own" : "other"}`}
              >
                <div className="bubble-header">
                  <span className="username">
                    {msg.user === username ? "You" : msg.user}
                  </span>
                  <span className="time">{msg.time}</span>
                </div>
                <div>{msg.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
