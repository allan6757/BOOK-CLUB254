import { API_BASE_URL } from '../config/api';

const API_BASE = `${API_BASE_URL}/api`;

export const fetchBooks = async () => {
  const response = await fetch(`${API_BASE}/books`);
  if (!response.ok) throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
  return response.json();
};

export const fetchBook = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/books/${id}`);
    if (!response.ok) throw new Error('Failed to fetch book');
    return response.json();
  } catch (error) {
    // Fallback to mock data
    const { mockBooks } = await import('../data/mockBooks');
    const book = mockBooks.find(book => book.id === parseInt(id));
    if (!book) throw new Error('Book not found');
    return {
      ...book,
      created_at: new Date().toISOString()
    };
  }
};

export const createBook = async (bookData) => {
  const response = await fetch(`${API_BASE}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to create book: ${response.status} - ${errorData}`);
  }
  return response.json();
};

export const updateBook = async (id, bookData) => {
  const response = await fetch(`${API_BASE}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  });
  if (!response.ok) throw new Error('Failed to update book');
  return response.json();
};

export const deleteBook = async (id) => {
  const response = await fetch(`${API_BASE}/books/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete book');
  return response.ok;
};