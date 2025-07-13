import { useState, useEffect } from 'react';
import type { Restaurant, Direction, RestaurantDetails } from './types';
import SwipeView from './components/SwipeView';
import RestaurantDetailModal from './components/RestaurantDetailModal';
import LocationSelector from './components/LocationSelector';

const API_BASE_URL = 'http://localhost:5050/api';

interface LocationInfo {
  lat: number;
  lon: number;
  name: string;
}

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [likedRestaurants, setLikedRestaurants] = useState<Restaurant[]>([]);
  const [currentView, setCurrentView] = useState<'location' | 'swipe' | 'likes'>('location');
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch restaurants when location is available
  useEffect(() => {
    if (location && currentView === 'swipe') {
      fetchRestaurants(location);
    }
  }, [location, currentView]);

  const fetchRestaurants = async (locationInfo: LocationInfo) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/restaurants?lat=${locationInfo.lat}&lon=${locationInfo.lon}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      
      const data = await response.json();
      setRestaurants(data);
    } catch (err) {
      setError('Failed to fetch restaurants. Please try again.');
      console.error('Restaurant fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (locationInfo: LocationInfo) => {
    setLocation(locationInfo);
    setCurrentView('swipe');
    setError(null);
  };

  const handleUseCurrentLocation = () => {
    setLoading(true);
    setError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationInfo: LocationInfo = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          name: 'Current Location'
        };
        setLocation(locationInfo);
        setCurrentView('swipe');
        setLoading(false);
      },
      (error) => {
        setError(`Location access denied: ${error.message}`);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const handleChangeLocation = () => {
    setCurrentView('location');
    setRestaurants([]);
    setError(null);
  };

  const handleSwipe = async (direction: Direction, restaurant: Restaurant) => {
    if (direction === 'right') {
      try {
        await fetch(`${API_BASE_URL}/like`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ place_id: restaurant.place_id }),
        });
        setLikedRestaurants(prev => [...prev, restaurant]);
      } catch (e) {
        console.error("Failed to like restaurant", e);
      }
    }
    // Remove the swiped restaurant from the list
    setRestaurants(prev => prev.filter(r => r.place_id !== restaurant.place_id));
  };

  const handleShowDetails = async (placeId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/restaurant/${placeId}`);
      const data: RestaurantDetails = await res.json();
      setSelectedRestaurant(data);
      setIsModalOpen(true);
    } catch (e) {
      console.error("Failed to fetch restaurant details", e);
    }
  };

  const fetchLikedRestaurants = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/liked-restaurants`);
      const data = await res.json();
      setLikedRestaurants(data);
    } catch (e) {
      console.error("Failed to fetch liked restaurants", e);
    }
  };

  // Fetch liked restaurants when switching to the 'likes' view
  useEffect(() => {
    if (currentView === 'likes') {
      fetchLikedRestaurants();
    }
  }, [currentView]);

  // Location Selection View
  if (currentView === 'location') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <LocationSelector
          onLocationSelect={handleLocationSelect}
          onUseCurrentLocation={handleUseCurrentLocation}
          loading={loading}
          error={error}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h1 className="text-2xl font-bold text-indigo-600 ml-2">Binge</h1>
              
              {/* Location Display */}
              {location && (
                <div className="ml-6 flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate max-w-32">{location.name}</span>
                  <button
                    onClick={handleChangeLocation}
                    className="ml-2 text-indigo-600 hover:text-indigo-800 text-xs underline"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
            
            <nav className="flex space-x-2">
              <button
                onClick={() => setCurrentView('swipe')}
                className={`px-4 py-2 rounded-full transition-all ${
                  currentView === 'swipe'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="ml-1 hidden sm:inline">Discover</span>
                </div>
              </button>
              <button
                onClick={() => setCurrentView('likes')}
                className={`px-4 py-2 rounded-full transition-all ${
                  currentView === 'likes'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="ml-1 hidden sm:inline">Liked</span>
                  <span className="ml-1">({likedRestaurants.length})</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16 pb-6 px-4">
        {currentView === 'swipe' ? (
          loading ? (
            <div className="flex flex-col items-center justify-center h-[80vh]">
              <svg className="animate-spin h-12 w-12 text-indigo-600 mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-gray-600">Loading restaurants in {location?.name}...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-[80vh]">
              <svg className="w-16 h-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 text-center mb-4">{error}</p>
              <button
                onClick={handleChangeLocation}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Different Location
              </button>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[80vh]">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No restaurants found</h3>
              <p className="text-gray-500 text-center mb-4">
                We couldn't find any highly-rated restaurants in {location?.name}.
              </p>
              <button
                onClick={handleChangeLocation}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Different Location
              </button>
            </div>
          ) : (
            <SwipeView
              restaurants={restaurants}
              onSwipe={handleSwipe}
              onShowDetails={handleShowDetails}
            />
          )
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {likedRestaurants.map((restaurant) => (
                <div
                  key={restaurant.place_id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    <img
                      src={restaurant.image_url}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {restaurant.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 font-medium">{restaurant.address}</p>
                    <div className="flex items-center mt-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < restaurant.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-1">
                        ({restaurant.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {likedRestaurants.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No liked restaurants yet
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    Start discovering and liking restaurants to build your collection of favorite places.
                  </p>
                  <button
                    onClick={() => setCurrentView('swipe')}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                  >
                    Start Discovering
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      {isModalOpen && selectedRestaurant && (
        <RestaurantDetailModal
          restaurant={selectedRestaurant}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
