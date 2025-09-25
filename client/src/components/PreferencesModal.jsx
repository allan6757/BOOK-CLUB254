import React, { useState } from 'react';

function PreferencesModal({ isOpen, onClose, onSave }) {
  const [preferences, setPreferences] = useState({
    genres: [],
    authors: [],
    readingGoal: 'casual'
  });

  const genres = [
    'Fiction', 'Science Fiction', 'Fantasy', 'Romance', 'Thriller', 
    'Mystery', 'Biography', 'History', 'Self-Help', 'Business'
  ];

  const readingGoals = [
    { value: 'casual', label: 'Casual Reader (1-2 books/month)' },
    { value: 'regular', label: 'Regular Reader (3-5 books/month)' },
    { value: 'avid', label: 'Avid Reader (6+ books/month)' }
  ];

  const handleGenreToggle = (genre) => {
    setPreferences(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleSave = () => {
    onSave(preferences);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="preferences-modal">
        <h2>Set Your Reading Preferences</h2>
        <p>Help us personalize your book recommendations</p>
        
        <div className="preference-section">
          <h3>Favorite Genres</h3>
          <div className="genre-options">
            {genres.map(genre => (
              <button
                key={genre}
                className={`genre-option ${preferences.genres.includes(genre) ? 'selected' : ''}`}
                onClick={() => handleGenreToggle(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="preference-section">
          <h3>Reading Goal</h3>
          <div className="reading-goals">
            {readingGoals.map(goal => (
              <label key={goal.value} className="radio-option">
                <input
                  type="radio"
                  name="readingGoal"
                  value={goal.value}
                  checked={preferences.readingGoal === goal.value}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    readingGoal: e.target.value
                  }))}
                />
                <span>{goal.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={handleSave} className="btn btn-gradient">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreferencesModal;