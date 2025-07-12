import { useState, useEffect } from 'react';
import axios from 'axios';
import { Restaurant, Direction } from './types';
import SwipeView from './components/SwipeView';
import LikedRestaurantsView from './components/LikedRestaurantsView';

function App() {
  const [currentView, setCurrentView] = useState<'swipe' | 'likes'>('swipe');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [likedRestaurants, setLikedRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleSwipe = async (direction: Direction, restaurant: Restaurant) => {
    if (direction === 'right') {
      try {
        await axios.post('http://localhost:5000/api/like', {
          restaurant_id: restaurant.id
        });
        const response = await axios.get('http://localhost:5000/api/liked-restaurants');
        setLikedRestaurants(response.data);
      } catch (error) {
        console.error('Error liking restaurant:', error);
      }
    }
    // Remove the swiped restaurant from the stack
    setRestaurants(prev => prev.filter(r => r.id !== restaurant.id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-indigo-600">Binge</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setCurrentView('swipe')}
                className={`px-4 py-2 rounded-md ${
                  currentView === 'swipe'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Discover
              </button>
              <button
                onClick={() => setCurrentView('likes')}
                className={`ml-4 px-4 py-2 rounded-md ${
                  currentView === 'likes'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Liked
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {currentView === 'swipe' ? (
          <SwipeView
            restaurants={restaurants}
            onSwipe={handleSwipe}
          />
        ) : (
          <LikedRestaurantsView
            restaurants={likedRestaurants}
          />
        )}
      </main>
    </div>
  );
}

export default App; 