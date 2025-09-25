import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      const savedPreferences = localStorage.getItem(`userPreferences_${userData.id}`);
      if (savedPreferences) {
        setUserPreferences(JSON.parse(savedPreferences));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email) => {
    // Mock login - create user from email
    const mockUser = {
      id: Date.now(),
      username: email.split('@')[0],
      email: email
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return { user: mockUser };
  };

  const signup = async (userData) => {
    // Mock signup - create user from form data
    const mockUser = {
      id: Date.now(),
      username: userData.username,
      email: userData.email
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return { user: mockUser };
  };

  const logout = () => {
    setUser(null);
    setUserPreferences(null);
    localStorage.removeItem('user');
  };

  const savePreferences = (preferences) => {
    setUserPreferences(preferences);
    const userId = user?.id || 'guest';
    localStorage.setItem(`userPreferences_${userId}`, JSON.stringify(preferences));
  };

  const value = {
    user,
    userPreferences,
    login,
    signup,
    logout,
    savePreferences,
    isAuthenticated: !!user,
    hasPreferences: !!userPreferences
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};