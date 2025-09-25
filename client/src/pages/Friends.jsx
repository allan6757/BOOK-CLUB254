import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fetchRecommendations, updateRecommendationStatus } from '../api/recommendations';
import RecommendBookModal from '../components/RecommendBookModal';

function Friends() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const { showToast } = useToast();

  // Mock data and load recommendations
  useEffect(() => {
    setFriends([
      { id: 1, username: 'bookworm123', email: 'book@example.com' },
      { id: 2, username: 'reader456', email: 'reader@example.com' }
    ]);
    setFriendRequests([
      { id: 3, username: 'newreader', email: 'new@example.com' }
    ]);
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const recs = await fetchRecommendations();
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setSearchResults([
        { id: 4, username: searchTerm, email: `${searchTerm}@example.com` }
      ]);
    }
  };

  const sendFriendRequest = (userId) => {
    showToast('Friend request sent!', 'success');
    setSearchResults([]);
    setSearchTerm('');
  };

  const handleRecommendBook = (friend) => {
    setSelectedFriend(friend);
    setShowRecommendModal(true);
  };

  const handleRecommendationAction = async (recommendationId, action) => {
    try {
      await updateRecommendationStatus(recommendationId, action);
      setRecommendations(recommendations.map(rec => 
        rec.id === recommendationId ? { ...rec, status: action } : rec
      ));
      showToast(`Recommendation ${action}!`, 'success');
    } catch (error) {
      showToast('Failed to update recommendation', 'error');
    }
  };

  const acceptFriendRequest = (request) => {
    setFriends([...friends, request]);
    setFriendRequests(friendRequests.filter(req => req.id !== request.id));
  };

  const rejectFriendRequest = (requestId) => {
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
  };

  return (
    <div className="friends-page">
      <div className="friends-container">
        <h1 className="page-title">Friends</h1>
        
        <div className="friends-tabs">
          <button 
            className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            My Friends ({friends.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations ({recommendations.filter(r => r.status === 'pending').length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Friend Requests ({friendRequests.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Find Friends
          </button>
        </div>

        {activeTab === 'friends' && (
          <div className="friends-list">
            <h2>My Friends</h2>
            {friends.length === 0 ? (
              <p>No friends yet. Start by finding some friends!</p>
            ) : (
              friends.map(friend => (
                <div key={friend.id} className="friend-card">
                  <div className="friend-info">
                    <h3>{friend.username}</h3>
                    <p>{friend.email}</p>
                  </div>
                  <div className="friend-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleRecommendBook(friend)}
                    >
                      ◆ Recommend Book
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="recommendations-list">
            <h2>Book Recommendations</h2>
            {recommendations.length === 0 ? (
              <p>No book recommendations yet.</p>
            ) : (
              recommendations.map(rec => (
                <div key={rec.id} className="recommendation-card">
                  <div className="recommendation-info">
                    <h3>{rec.book.title}</h3>
                    <p>by {rec.book.author}</p>
                    <p className="from-user">Recommended by {rec.from_user.username}</p>
                    {rec.message && <p className="rec-message">"{rec.message}"</p>}
                  </div>
                  <div className="recommendation-actions">
                    {rec.status === 'pending' ? (
                      <>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleRecommendationAction(rec.id, 'accepted')}
                        >
                          ◉ Accept
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleRecommendationAction(rec.id, 'dismissed')}
                        >
                          ◯ Dismiss
                        </button>
                      </>
                    ) : (
                      <span className={`status-badge status-${rec.status}`}>
                        {rec.status === 'accepted' ? '◉ Accepted' : '◯ Dismissed'}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="friend-requests">
            <h2>Friend Requests</h2>
            {friendRequests.length === 0 ? (
              <p>No pending friend requests.</p>
            ) : (
              friendRequests.map(request => (
                <div key={request.id} className="friend-card">
                  <div className="friend-info">
                    <h3>{request.username}</h3>
                    <p>{request.email}</p>
                  </div>
                  <div className="friend-actions">
                    <button 
                      className="btn btn-success"
                      onClick={() => acceptFriendRequest(request)}
                    >
                      Accept
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => rejectFriendRequest(request.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="friend-search">
            <h2>Find Friends</h2>
            <div className="search-form">
              <input
                type="text"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button onClick={handleSearch} className="btn btn-primary">
                Search
              </button>
            </div>
            
            {searchResults.map(user => (
              <div key={user.id} className="friend-card">
                <div className="friend-info">
                  <h3>{user.username}</h3>
                  <p>{user.email}</p>
                </div>
                <div className="friend-actions">
                  <button 
                    className="btn btn-gradient"
                    onClick={() => sendFriendRequest(user.id)}
                  >
                    Send Friend Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <RecommendBookModal
          friend={selectedFriend}
          isOpen={showRecommendModal}
          onClose={() => {
            setShowRecommendModal(false);
            setSelectedFriend(null);
          }}
        />
      </div>
    </div>
  );
}

export default Friends;