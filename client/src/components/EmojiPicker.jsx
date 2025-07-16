// client/src/components/EmojiPicker.jsx
import React from 'react';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

const EmojiPicker = ({ onSelect }) => {
  return (
    <div className="emoji-picker">
      <Picker onSelect={onSelect} title="Pick your emoji" emoji="point_up" />
    </div>
  );
};

export default EmojiPicker;
