import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import { fetchBooks } from '../api/books';

function BookList({ searchTerm = '', genreFilter = '' }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Failed to load books. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !genreFilter || book.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  if (loading) return <div>Loading books...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="book-list">
      {filteredBooks.length === 0 ? (
        <p>No books found.</p>
      ) : (
        filteredBooks.map(book => (
          <BookCard key={book.id} book={book} />
        ))
      )}
    </div>
  );
}

export default BookList;