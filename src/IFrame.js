import React, { useState } from 'react';
import axios from 'axios';

const NoteTaker = ({ onAddNote }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setNote(e.target.value);
  };

  const handleAddNote = () => {
    if (note.trim()) {
      onAddNote(note);
      setNote('');
    }
  };

  const handleGenerateNote = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://api.mistral.ai/v1/generate-notes', {
        video_url: window.currentVideoURL,
        api_key: process.env.REACT_APP_MISTRAL_API_KEY
      });
      const generatedNote = response.data.note;
      onAddNote(generatedNote);
    } catch (error) {
      console.error('Error generating note:', error);
      setError('Error generating note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-taker">
      <textarea
        value={note}
        onChange={handleChange}
        placeholder="Write your notes here..."
        rows="4"
      />
      <button onClick={handleAddNote}>Add Note</button>
      <button onClick={handleGenerateNote}>Generate Note with AI</button>
      {loading && <p>Generating note...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default NoteTaker;
