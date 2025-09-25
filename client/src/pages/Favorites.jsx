import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchFavorites, removeFromFavorites } from '../api/favorites';
import BookCard from '../components/BookCard';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await fetchFavorites();
        setFavorites(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, []);

  const handleExportFavorites = () => {
    const favoritesData = favorites.map(fav => ({
      title: fav.book.title,
      author: fav.book.author,
      genre: fav.book.genre,
      description: fav.book.description,
      added_date: new Date(fav.added_at).toLocaleDateString()
    }));
    
    const csvContent = [
      'Title,Author,Genre,Description,Date Added',
      ...favoritesData.map(book => 
        `"${book.title}","${book.author}","${book.genre}","${book.description.replace(/"/g, '""')}","${book.added_date}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_favorite_books_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRemoveFavorite = async (bookId) => {
    try {
      await removeFromFavorites(bookId);
      setFavorites(favorites.filter(fav => fav.book_id !== bookId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">❤️</div>
        <p>Loading your favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Favorites</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="page-header">
        <h1 className="page-title">My Favorites</h1>
        <p className="page-subtitle">
          {favorites.length} favorite book{favorites.length !== 1 ? 's' : ''} in your collection
        </p>
      </div>
      
      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤍</div>
          <h3>No favorites yet</h3>
          <p>Start adding books to your favorites by clicking the heart icon!</p>
          <Link to="/" className="btn btn-primary">Browse Books</Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(favorite => (
            <div key={favorite.id} className="favorite-item">
              <BookCard book={favorite.book} />
              <div className="favorite-actions">
                <button 
                  onClick={() => handleRemoveFavorite(favorite.book_id)}
                  className="btn btn-danger btn-sm"
                >
                  💔 Remove from Favorites
                </button>
                <button 
                  onClick={() => handleExportFavorites()}
                  className="btn btn-export btn-sm"
                  title="Export favorites list"
                >
                  📊 Export List
                </button>
                <span className="favorite-date">
                  Added {new Date(favorite.added_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;