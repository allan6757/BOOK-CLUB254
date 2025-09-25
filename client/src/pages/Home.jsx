import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { fetchBooks } from '../api/books';
import BookCard from '../components/BookCard';
import PreferencesModal from '../components/PreferencesModal';
import { useAuth } from '../context/AuthContext';
import { mockBooks } from '../data/mockBooks';

function Home() {
  const [books, setBooks] = useState([]);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [showPreferences, setShowPreferences] = useState(false);
  const { userPreferences, hasPreferences, savePreferences, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        console.log('Fetched books from API:', data);
        if (data && data.length > 0) {
          setBooks(data);
        } else {
          console.log('No books from API, using mock books');
          setBooks(mockBooks);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        console.log('Using mock books due to error');
        setBooks(mockBooks);
      }
    };
    loadBooks();
  }, []);

  useEffect(() => {
    if (!hasPreferences) {
      setShowPreferences(true);
    }
  }, [hasPreferences]);

  const filteredBooks = useMemo(() => 
    books.filter(book => 
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [books, searchTerm]
  );
  

  
  const personalizedBooks = useMemo(() => {
    if (!userPreferences || !userPreferences.genres.length) {
      return books;
    }
    
    const preferred = books.filter(book => 
      userPreferences.genres.includes(book.genre)
    );
    const others = books.filter(book => 
      !userPreferences.genres.includes(book.genre)
    );
    
    return [...preferred, ...others];
  }, [books, userPreferences]);

  const displayBooks = useMemo(() => personalizedBooks.slice(0, 12), [personalizedBooks]);



  const handlePreferencesSave = (preferences) => {
    savePreferences(preferences);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(localSearchTerm)}`);
    } else {
      navigate('/');
    }
  };

  const clearSearch = () => {
    setLocalSearchTerm('');
    navigate('/');
  };

  return (
    <div className="home">
      <PreferencesModal 
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        onSave={handlePreferencesSave}
      />
      
      <div className="hero">
        <div className="hero-content">
          <div className="welcome-message">
            <span className="welcome-text">Welcome back, {user?.username || 'Reader'}! ◆</span>
          </div>
          <h1 className="hero-title">Book Warmz</h1>
          <p className="hero-subtitle">
            {hasPreferences 
              ? `Personalized recommendations based on your preferences`
              : 'Discover amazing books and connect with fellow readers'
            }
          </p>
          {hasPreferences && (
            <button 
              onClick={() => setShowPreferences(true)}
              className="btn btn-outline preferences-btn"
            >
              Update Preferences
            </button>
          )}
        </div>
      </div>
      
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              🔍
            </button>
            {searchTerm && (
              <button type="button" onClick={clearSearch} className="clear-btn">
                ✕
              </button>
            )}
          </div>
        </form>
      </div>
      
      {!searchTerm && (
        <section className="book-of-day-section">
          <div className="book-of-day-container">
            <h2 className="section-title">📚 Book of the Day</h2>
            {books.length > 0 && (
              <div className="featured-book">
                <BookCard book={books[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % books.length]} />
                <div className="featured-badge">
                  <span>⭐ Featured Today</span>
                  <p>Specially selected for our community</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      
      <section className="books-section">
        {searchTerm ? (
          <>
            <h2 className="section-title">Search Results for "{searchTerm}"</h2>
            {filteredBooks.length === 0 ? (
              <div className="no-results">
                <p>No books found matching your search.</p>
                <Link to="/" className="btn btn-primary">
                  Browse All Books
                </Link>
              </div>
            ) : (
              <div className="book-grid">
                {filteredBooks.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="section-title">
              {hasPreferences ? 'Recommended for You' : 'All Books'}
            </h2>
            <div className="book-grid">
              {displayBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            
            {!searchTerm && books.length > 12 && (
              <div className="load-more-section">
                <Link to="/books" className="btn btn-gradient">
                  🔍 Explore All {books.length} Books
                </Link>
              </div>
            )}
          </>
        )}
      </section>

    </div>
  );
}

export default Home;