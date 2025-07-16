// client/src/components/ChatBox.jsx
import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EmojiPicker from './EmojiPicker';

const ChatBox = ({ messages, onSendMessage, onTyping, typingUser, username, userCount, activeUsers, onReact, onClearChat }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef(null);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    onTyping();
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage({ type: 'text', content: message });
      setMessage('');
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onSendMessage({
        type: file.type.startsWith('image/') ? 'image' : 'file',
        content: reader.result,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className="chat-box-wrapper">
      <aside className="sidebar">
        <h4>👤 Users Online</h4>
        <ul>
          {activeUsers.map((user, i) => (
            <li key={i}>{user === username ? '🧍 You' : user}</li>
          ))}
        </ul>
        <button className="clear-btn" onClick={onClearChat}>🧹 Clear Chat</button>
      </aside>

      <div className="chat-box">
        <div className="chat-header">
          <h3>💬 Chat Room</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="online-status">🟢 {userCount} online</span>
            <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)} title="Toggle Theme">
              {darkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} index={index} onReact={onReact} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <TypingIndicator typingUser={typingUser} />

        <div className="chat-input">
          <button onClick={() => setShowEmojiPicker((prev) => !prev)}>😊</button>
          {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />}
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <label className="upload-btn">
            📎<input type="file" onChange={handleFileChange} hidden />
          </label>
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
