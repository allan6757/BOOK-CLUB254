import React, { useState, useEffect } from 'react';
import ReadingListItem from '../components/ReadingListItem';
import { fetchReadingList } from '../api/readingList';

function MyList() {
  const [readingList, setReadingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReadingList = async () => {
      try {
        console.log('Fetching reading list...');
        const data = await fetchReadingList();
        console.log('Reading list data:', data);
        setReadingList(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching reading list:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadReadingList();
  }, []);

  const handleUpdate = (itemId, newStatus) => {
    setReadingList(readingList.map(item =>
      item.id === itemId ? { ...item, status: newStatus } : item
    ));
  };

  const handleRemove = (itemId) => {
    setReadingList(readingList.filter(item => item.id !== itemId));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">◆</div>
        <p>Loading your reading list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Reading List</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="my-list">
      <div className="page-header">
        <h1 className="page-title">My Reading List</h1>
        <p className="page-subtitle">
          {readingList.length} book{readingList.length !== 1 ? 's' : ''} in your library
        </p>
      </div>
      
      {readingList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">■</div>
          <h3>Your reading list is empty</h3>
          <p>Start adding books to build your personal library!</p>
          <a href="/" className="btn btn-primary">Browse Books</a>
        </div>
      ) : (
        <div className="reading-list">
          {readingList.map(item => (
            <ReadingListItem
              key={item.id}
              item={item}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyList;