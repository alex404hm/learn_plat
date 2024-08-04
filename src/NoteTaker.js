import React, { useState } from 'react';
import './App.css';

const NoteTaker = ({ onAddNote }) => {
  const [note, setNote] = useState('');

  const handleAddNote = () => {
    if (note.trim()) {
      onAddNote(note);
      setNote('');
    }
  };

  return (
    <div className="note-taker">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add your notes here..."
      />
      <button onClick={handleAddNote}>Add Note</button>
    </div>
  );
};

export default NoteTaker;
