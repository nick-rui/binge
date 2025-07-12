import { useState, useMemo, useRef } from 'react';
import React from 'react';
import TinderCard from 'react-tinder-card';
import type { Restaurant, Direction } from '../types';

interface SwipeViewProps {
  restaurants: Restaurant[];
  onSwipe: (direction: Direction, restaurant: Restaurant) => void;
  onShowDetails: (placeId: string) => void;
}

const SwipeView: React.FC<SwipeViewProps> = ({ restaurants, onSwipe, onShowDetails }) => {
  const [currentIndex, setCurrentIndex] = useState(restaurants.length - 1);
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(restaurants.length)
        .fill(0)
        .map(() => React.createRef<any>()),
    [restaurants.length]
  );
  
  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = currentIndex >= 0;

  const swiped = (direction: Direction, restaurant: Restaurant, index: number) => {
    updateCurrentIndex(index - 1);
    onSwipe(direction, restaurant);
  };

  const outOfFrame = (name: string, idx: number) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };


  return (
    <div className="relative h-[80vh] flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm h-[60vh] relative">
        {restaurants.map((restaurant, index) => (
          <TinderCard
            ref={childRefs[index]}
            key={restaurant.place_id}
            onSwipe={(dir) => swiped(dir as Direction, restaurant, index)}
            onCardLeftScreen={() => outOfFrame(restaurant.name, index)}
            preventSwipe={['up', 'down']}
            className="absolute cursor-grab active:cursor-grabbing"
          >
            <div className="relative w-[320px] h-[480px] rounded-3xl shadow-2xl overflow-hidden bg-white">
              <img
                src={restaurant.image_url}
                alt={restaurant.name}
                className="w-full h-full object-cover"
                draggable="false"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/70 to-transparent text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{restaurant.name}</h2>
                  <button onClick={() => onShowDetails(restaurant.place_id)} className="p-2 rounded-full bg-white/20 hover:bg-white/40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center mt-2">
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
                  <span className="text-sm opacity-90 ml-2">({restaurant.rating.toFixed(1)})</span>
                </div>
                <p className="text-sm opacity-90 mt-1 line-clamp-2">
                  {restaurant.address}
                </p>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>

      {/* Empty state */}
      {!canSwipe && (
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