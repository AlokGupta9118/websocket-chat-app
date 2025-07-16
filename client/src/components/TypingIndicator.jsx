// client/src/components/TypingIndicator.jsx
import React from 'react';

const TypingIndicator = ({ typingUser }) => {
  if (!typingUser) return null;

  return (
    <div className="typing-indicator">
      <em>{typingUser} is typing...</em>
    </div>
  );
};

export default TypingIndicator;
