import { useState } from 'react';
import TinderCard from 'react-tinder-card';
import { Restaurant, Direction } from '../types';

interface SwipeViewProps {
  restaurants: Restaurant[];
  onSwipe: (direction: Direction, restaurant: Restaurant) => void;
}

const SwipeView: React.FC<SwipeViewProps> = ({ restaurants, onSwipe }) => {
  const [currentIndex, setCurrentIndex] = useState(restaurants.length - 1);

  const handleSwipe = (direction: Direction, restaurant: Restaurant) => {
    setCurrentIndex(prev => prev - 1);
    onSwipe(direction, restaurant);
  };

  return (
    <div className="relative h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        {restaurants.map((restaurant, index) => (
          <div
            key={restaurant.id}
            className={`absolute w-full ${index !== currentIndex ? 'hidden' : ''}`}
          >
            <TinderCard
              onSwipe={(dir) => handleSwipe(dir as Direction, restaurant)}
              preventSwipe={['up', 'down']}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <img
                  src={restaurant.image_url}
                  alt={restaurant.dish}
                  className="w-full h-96 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {restaurant.name}
                  </h2>
                  <p className="text-gray-600 mt-1">{restaurant.dish}</p>
                  <p className="text-indigo-600 font-semibold mt-2">
                    {restaurant.price}
                  </p>
                </div>
              </div>
            </TinderCard>
          </div>
        ))}
      </div>

      {/* Swipe buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-8">
        <button
          onClick={() => {
            if (currentIndex >= 0) {
              handleSwipe('left', restaurants[currentIndex]);
            }
          }}
          className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <button
          onClick={() => {
            if (currentIndex >= 0) {
              handleSwipe('right', restaurants[currentIndex]);
            }
          }}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Empty state */}
      {currentIndex < 0 && (
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            No more restaurants to show!
          </h3>
          <p className="text-gray-500 mt-2">
            Check out your liked restaurants or come back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default SwipeView; 