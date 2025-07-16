// client/src/App.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';
import ChatBox from './components/ChatBox';

const socket = io('http://localhost:5000');

function App() {
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [typingUser, setTypingUser] = useState('');
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [audio] = useState(new Audio('/notification.mp3'));

  const handleSendMessage = (payload) => {
    const msgData = {
      user: username,
      ...payload,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
    };
    socket.emit('chatMessage', msgData);
    setMessages((prev) => [...prev, { ...msgData, fromSelf: true }]);
  };

  const handleTyping = () => {
    socket.emit('typing', username);
  };

  const handleReaction = (index, reaction) => {
    const updatedMessages = [...messages];
    updatedMessages[index].reactions.push({ user: username, emoji: reaction });
    setMessages(updatedMessages);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  useEffect(() => {
    socket.on('chatMessage', (msg) => {
      if (msg.user !== username) {
        setMessages((prev) => [...prev, { ...msg, fromSelf: false }]);
        audio.play();
      }
    });

    socket.on('userCount', (count) => {
      setUserCount(count);
    });

    socket.on('activeUsers', (userList) => {
      setActiveUsers(userList);
    });

    socket.on('typing', (user) => {
      if (user !== username) {
        setTypingUser(user);
        setTimeout(() => setTypingUser(''), 3000);
      }
    });

    return () => {
      socket.off('chatMessage');
      socket.off('userCount');
      socket.off('activeUsers');
      socket.off('typing');
    };
  }, [username]);

  const handleJoin = () => {
    if (username.trim() !== '') {
      setJoined(true);
      socket.emit('join', username);
    }
  };

  return (
    <div className="app-container">
      {!joined ? (
        <div className="enter-screen">
          <h2>Enter your name to join</h2>
          <input
            type="text"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleJoin}>Join Chat</button>
        </div>
      ) : (
        <ChatBox
          messages={messages}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          typingUser={typingUser}
          username={username}
          userCount={userCount}
          activeUsers={activeUsers}
          onReact={handleReaction}
          onClearChat={handleClearChat}
        />
      )}
    </div>
  );
}

export default App;
