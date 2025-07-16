// client/src/components/MessageBubble.jsx
import React from 'react';

const emojis = ['👍', '❤️', '😂', '🔥', '😮'];

const MessageBubble = ({ message, index, onReact }) => {
  const isOwn = message.fromSelf;

  const renderContent = () => {
    if (message.type === 'text') return <div className="message-text">{message.content}</div>;

    if (message.type === 'image') {
      return (
        <div className="message-text">
          <img src={message.content} alt="upload" className="chat-image" />
        </div>
      );
    }

    if (message.type === 'file') {
      return (
        <div className="message-text">
          <a href={message.content} download={message.fileName} target="_blank" rel="noreferrer">
            📄 {message.fileName}
          </a>
        </div>
      );
    }

    return <div className="message-text">Unsupported message</div>;
  };

  return (
    <div className={`message-row ${isOwn ? 'own' : 'other'}`}>
      <div className="message-bubble">
        <div className="message-meta">
          <span className="username">{isOwn ? 'You' : message.user}</span>
          <span className="timestamp">{message.time}</span>
        </div>

        {renderContent()}

        <div className="reactions">
          {message.reactions && message.reactions.map((r, i) => (
            <span key={i} className="reaction">{r.emoji}</span>
          ))}
        </div>

        <div className="reaction-buttons">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              className="reaction-btn"
              onClick={() => onReact(index, emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
