import { useState, useRef, useMemo } from 'react';
import TinderCard from 'react-tinder-card';
import type { Restaurant, Direction } from '../types';

interface SwipeViewProps {
  restaurants: Restaurant[];
  onSwipe: (direction: Direction, restaurant: Restaurant) => void;
}

const SwipeView: React.FC<SwipeViewProps> = ({ restaurants, onSwipe }) => {
  const [currentIndex, setCurrentIndex] = useState(restaurants.length - 1);
  const [lastDirection, setLastDirection] = useState<Direction>();
  const [showIndicator, setShowIndicator] = useState(false);
  const timeoutRef = useRef<number>();

  const currentRestaurant = useMemo(() => 
    currentIndex >= 0 ? restaurants[currentIndex] : null
  , [currentIndex, restaurants]);

  const handleSwipe = (direction: string) => {
    if (!currentRestaurant) return;
    
    // Only handle left and right swipes
    if (direction !== 'left' && direction !== 'right') return;
    
    const swipeDirection = direction as Direction;
    setLastDirection(swipeDirection);
    setShowIndicator(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    // Hide the indicator after 1.5 seconds
    timeoutRef.current = window.setTimeout(() => {
      setShowIndicator(false);
    }, 1500);

    setCurrentIndex(prev => prev - 1);
    onSwipe(swipeDirection, currentRestaurant);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating
            ? 'text-yellow-400'
            : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="relative h-[80vh] flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm h-[60vh] relative">
        {currentRestaurant && (
          <div className="absolute w-full flex justify-center">
            <TinderCard
              onSwipe={handleSwipe}
              preventSwipe={['up', 'down']}
              className="absolute cursor-grab active:cursor-grabbing"
            >
              <div className="relative w-[320px] h-[480px] rounded-3xl shadow-2xl overflow-hidden bg-white">
                <img
                  src={currentRestaurant.image_url}
                  alt={currentRestaurant.dish}
                  className="w-full h-full object-cover"
                  draggable="false"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/70 to-transparent text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{currentRestaurant.name}</h2>
                    <span className="text-lg font-bold">{currentRestaurant.price}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
                      {currentRestaurant.cuisine}
                    </span>
                    <div className="flex ml-2">
                      {renderStars(currentRestaurant.rating)}
                    </div>
                  </div>
                  <p className="text-lg font-semibold mt-2">{currentRestaurant.dish}</p>
                  <p className="text-sm opacity-90 mt-1 line-clamp-2">
                    {currentRestaurant.description}
                  </p>
                </div>

                {/* Swipe direction indicators */}
                {showIndicator && lastDirection === 'left' && (
                  <div className="absolute top-8 left-8">
                    <span className="swipe-indicator nope text-4xl font-bold text-red-500 border-4 border-red-500 px-4 py-1 rounded bg-white/80">
                      NOPE
                    </span>
                  </div>
                )}
                {showIndicator && lastDirection === 'right' && (
                  <div className="absolute top-8 right-8">
                    <span className="swipe-indicator like text-4xl font-bold text-green-500 border-4 border-green-500 px-4 py-1 rounded bg-white/80">
                      LIKE
                    </span>
                  </div>
                )}
              </div>
            </TinderCard>
          </div>
        )}
      </div>

      {/* Empty state */}
      {!currentRestaurant && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/95">
          <div className="text-center p-8 rounded-2xl">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No more dishes to discover!
            </h3>
            <p className="text-gray-600">
              Check out your liked restaurants or come back later for more delicious options.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeView; 