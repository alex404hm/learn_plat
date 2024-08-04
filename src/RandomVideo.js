import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteTaker from './NoteTaker';
import './App.css';

const genres = ['science', 'technology', 'programming', 'news'];

const RandomVideo = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('science');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [questions, setQuestions] = useState([]);

  // Function to fetch popular and educational videos
  const fetchRandomVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://${process.env.REACT_APP_RAPIDAPI_HOST}/search`, {
        params: {
          q: `${selectedGenre} educational`,
          part: 'snippet',
          type: 'video',
          maxResults: 5,
          order: 'viewCount', // Order by view count to get popular videos
          relevanceLanguage: 'en', // Language filter if needed
          videoCategoryId: '27', // Category ID for 'Education'
        },
        headers: {
          'X-RapidAPI-Host': process.env.REACT_APP_RAPIDAPI_HOST,
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
        },
      });

      const videoList = response.data.items;
      setVideos(videoList);
      setCurrentVideoIndex(0);
      fetchAIQuestions(videoList[0].snippet.title);
    } catch (err) {
      setError('Error fetching videos');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch AI-generated questions
  const fetchAIQuestions = async (title) => {
    try {
      const response = await axios.post('https://api.mistral.ai/ask', {
        query: `Generate insightful questions about the video titled: ${title}`
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_MISTRAL_API_KEY}`
        }
      });

      setQuestions(response.data.questions);
    } catch (err) {
      console.error('Error fetching questions from AI', err);
    }
  };

  // Function to handle genre change
  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  // Function to handle adding notes
  const handleAddNote = (note) => {
    setNotes([...notes, note]);
  };

  // Function to handle next video
  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      fetchAIQuestions(videos[currentVideoIndex + 1].snippet.title);
    }
  };

  // Function to handle previous video
  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      fetchAIQuestions(videos[currentVideoIndex - 1].snippet.title);
    }
  };

  // Use effect to fetch videos on genre change
  useEffect(() => {
    fetchRandomVideos();
  }, [selectedGenre]);

  return (
    <div className="container">
      <header>
        <h1>Random Educational Videos</h1>
      </header>
      <div className="content">
        <div className="genre-selector">
          <select
            value={selectedGenre}
            onChange={handleGenreChange}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="video-container">
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {videos.length > 0 && !loading && (
            <>
              <iframe
                width="100%"
                height="450"
                src={`https://www.youtube.com/embed/${videos[currentVideoIndex].id.videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="video-controls">
                <button onClick={handlePreviousVideo} disabled={currentVideoIndex === 0}>Previous</button>
                <button onClick={handleNextVideo} disabled={currentVideoIndex === videos.length - 1}>Next</button>
              </div>
              <NoteTaker onAddNote={handleAddNote} />
              <div className="notes-section">
                <h3>Notes</h3>
                <ul>
                  {notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
              <div className="questions-section">
                <h3>Suggested Questions</h3>
                <ul>
                  {questions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RandomVideo;
