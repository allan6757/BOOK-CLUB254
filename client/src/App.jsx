import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import About from './pages/About';
import BookPage from './pages/BookPage';
import BookEdit from './pages/BookEdit';
import MyList from './pages/MyList';
import Favorites from './pages/Favorites';
import Friends from './pages/Friends';
import Login from './pages/Login';
import Signup from './pages/Signup';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return (
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    );
  }
  
  return (
    <div className="App">
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/books/:id" element={<BookPage />} />
          <Route path="/books/:id/edit" element={<BookEdit />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;