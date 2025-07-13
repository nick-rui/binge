import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import React from 'react';
import type { Restaurant, Direction } from '../types';

interface SwipeViewProps {
  restaurants: Restaurant[];
  onSwipe: (direction: Direction, restaurant: Restaurant) => void;
  onShowDetails: (placeId: string) => void;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  dragDistance: number;
  dragDirection: 'left' | 'right' | 'center';
}

const SwipeView: React.FC<SwipeViewProps> = ({ restaurants, onSwipe, onShowDetails }) => {
  const [currentIndex, setCurrentIndex] = useState(restaurants.length - 1);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    dragDistance: 0,
    dragDirection: 'center'
  });
  
  const [showMessage, setShowMessage] = useState<{
    type: 'like' | 'nope' | null;
    visible: boolean;
  }>({ type: null, visible: false });

  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const currentRestaurant = restaurants[currentIndex];
  const canSwipe = currentIndex >= 0 && currentIndex < restaurants.length;

  const SWIPE_THRESHOLD = 100; // pixels
  const ROTATION_FACTOR = 0.1; // rotation multiplier

  // Update currentIndex when restaurants array changes
  useEffect(() => {
    if (restaurants.length > 0) {
      setCurrentIndex(Math.min(currentIndex, restaurants.length - 1));
    }
  }, [restaurants.length]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current = []; // Clear the array
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canSwipe) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Prevent default to avoid text selection
    e.preventDefault();

    setDragState({
      isDragging: true,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      currentX: e.clientX - rect.left,
      currentY: e.clientY - rect.top,
      dragDistance: 0,
      dragDirection: 'center'
    });
  }, [canSwipe]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.isDragging || !canSwipe) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const dragDistance = currentX - dragState.startX;
    const dragDirection = dragDistance > 30 ? 'right' : dragDistance < -30 ? 'left' : 'center';

    setDragState(prev => ({
      ...prev,
      currentX,
      currentY,
      dragDistance,
      dragDirection
    }));
  }, [dragState.isDragging, dragState.startX, canSwipe]);

  const handleMouseUp = useCallback(() => {
    if (!dragState.isDragging || !canSwipe || !currentRestaurant) return;

    const shouldSwipe = Math.abs(dragState.dragDistance) > SWIPE_THRESHOLD;
    const direction = dragState.dragDistance > 0 ? 'right' : 'left';

    if (shouldSwipe) {
      // Show message popup
      setShowMessage({
        type: direction === 'right' ? 'like' : 'nope',
        visible: true
      });

      // Hide message after 1 second
      const messageTimeout = setTimeout(() => {
        setShowMessage({ type: null, visible: false });
      }, 1000);
      timeoutRefs.current.push(messageTimeout);

      // Trigger swipe action
      const swipeTimeout = setTimeout(() => {
        onSwipe(direction, currentRestaurant);
        setCurrentIndex(prev => prev - 1);
      }, 300);
      timeoutRefs.current.push(swipeTimeout);
    }

    setDragState({
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      dragDistance: 0,
      dragDirection: 'center'
    });
  }, [dragState.isDragging, dragState.dragDistance, canSwipe, currentRestaurant, onSwipe]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!canSwipe || e.touches.length !== 1) return;
    
    e.preventDefault(); // Prevent scrolling
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touch = e.touches[0];
    setDragState({
      isDragging: true,
      startX: touch.clientX - rect.left,
      startY: touch.clientY - rect.top,
      currentX: touch.clientX - rect.left,
      currentY: touch.clientY - rect.top,
      dragDistance: 0,
      dragDirection: 'center'
    });
  }, [canSwipe]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragState.isDragging || !canSwipe || e.touches.length !== 1) return;

    e.preventDefault(); // Prevent scrolling
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touch = e.touches[0];
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;
    const dragDistance = currentX - dragState.startX;
    const dragDirection = dragDistance > 30 ? 'right' : dragDistance < -30 ? 'left' : 'center';

    setDragState(prev => ({
      ...prev,
      currentX,
      currentY,
      dragDistance,
      dragDirection
    }));
  }, [dragState.isDragging, dragState.startX, canSwipe]);

  const handleTouchEnd = useCallback(() => {
    if (!dragState.isDragging || !canSwipe || !currentRestaurant) return;

    const shouldSwipe = Math.abs(dragState.dragDistance) > SWIPE_THRESHOLD;
    const direction = dragState.dragDistance > 0 ? 'right' : 'left';

    if (shouldSwipe) {
      // Show message popup
      setShowMessage({
        type: direction === 'right' ? 'like' : 'nope',
        visible: true
      });

      // Hide message after 1 second
      const messageTimeout = setTimeout(() => {
        setShowMessage({ type: null, visible: false });
      }, 1000);
      timeoutRefs.current.push(messageTimeout);

      // Trigger swipe action
      const swipeTimeout = setTimeout(() => {
        onSwipe(direction, currentRestaurant);
        setCurrentIndex(prev => prev - 1);
      }, 300);
      timeoutRefs.current.push(swipeTimeout);
    }

    setDragState({
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      dragDistance: 0,
      dragDirection: 'center'
    });
  }, [dragState.isDragging, dragState.dragDistance, canSwipe, currentRestaurant, onSwipe]);

  const cardStyle = useMemo(() => {
    if (!dragState.isDragging) {
      return {
        transform: 'translate(0px, 0px) rotate(0deg)',
        transition: 'transform 0.3s ease-out'
      };
    }

    const rotation = dragState.dragDistance * ROTATION_FACTOR;
    return {
      transform: `translate(${dragState.dragDistance}px, 0px) rotate(${rotation}deg)`,
      transition: 'none'
    };
  }, [dragState.isDragging, dragState.dragDistance]);

  const cardOpacity = useMemo(() => {
    return 1; // Always keep cards 100% opaque
  }, []);

  const handleInfoClick = useCallback((e: React.MouseEvent, placeId: string) => {
    e.stopPropagation();
    e.preventDefault();
    onShowDetails(placeId);
  }, [onShowDetails]);

  const handleImageError = useCallback((placeId: string) => {
    setImageErrors(prev => new Set(prev).add(placeId));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!canSwipe || !currentRestaurant) return;
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onSwipe('left', currentRestaurant);
      setCurrentIndex(prev => prev - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onSwipe('right', currentRestaurant);
      setCurrentIndex(prev => prev - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onShowDetails(currentRestaurant.place_id);
    }
  }, [canSwipe, currentRestaurant, onSwipe, onShowDetails]);

  const getSafeRating = (rating: number | undefined | null): number => {
    if (typeof rating !== 'number' || isNaN(rating) || rating < 0) return 0;
    return Math.min(5, Math.max(0, rating));
  };

  return (
    <div 
      className="relative h-[80vh] flex flex-col items-center justify-center bg-gray-50 overflow-hidden"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Restaurant swipe interface"
    >
      {/* Drop Zones */}
      <div className="absolute inset-0 flex">
        {/* Left Zone - NOPE */}
        <div
          className={`w-1/3 flex items-center justify-center transition-all duration-300 ${
            dragState.dragDirection === 'left' && dragState.isDragging
              ? 'bg-red-500/20 backdrop-blur-sm'
              : 'bg-transparent'
          }`}
          aria-label="Reject zone"
        >
          <div
            className={`text-center transition-all duration-300 ${
              dragState.dragDirection === 'left' && dragState.isDragging
                ? 'scale-110 opacity-100'
                : 'scale-75 opacity-30'
            }`}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-red-600">NOPE</h3>
          </div>
        </div>

        {/* Middle Grey Area */}
        <div className="w-1/3"></div>

        {/* Right Zone - LIKE */}
        <div
          className={`w-1/3 flex items-center justify-center transition-all duration-300 ${
            dragState.dragDirection === 'right' && dragState.isDragging
              ? 'bg-green-500/20 backdrop-blur-sm'
              : 'bg-transparent'
          }`}
          aria-label="Like zone"
        >
          <div
            className={`text-center transition-all duration-300 ${
              dragState.dragDirection === 'right' && dragState.isDragging
                ? 'scale-110 opacity-100'
                : 'scale-75 opacity-30'
            }`}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-green-600">LIKE</h3>
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div 
        ref={containerRef}
        className="w-full max-w-xs sm:max-w-sm h-[60vh] relative z-10"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {restaurants.map((restaurant, index) => {
          const isTopCard = index === currentIndex;
          const isVisible = index === currentIndex; // Only show the current top card
          
          if (!isVisible) return null;

          const safeRating = getSafeRating(restaurant.rating);

          return (
            <div
              key={restaurant.place_id}
              ref={isTopCard ? cardRef : null}
              className={`absolute cursor-grab active:cursor-grabbing`}
              style={{
                ...cardStyle,
                left: '50%',
                top: '50%',
                marginLeft: '-140px',
                marginTop: '-200px',
                zIndex: 10
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              role="img"
              aria-label={`Restaurant card: ${restaurant.name}`}
            >
              <div className="relative w-[280px] h-[400px] sm:w-[320px] sm:h-[480px] rounded-3xl shadow-2xl overflow-hidden bg-white">
                {imageErrors.has(restaurant.place_id) ? (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 text-sm">Image unavailable</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={restaurant.image_url}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    draggable="false"
                    onError={() => handleImageError(restaurant.place_id)}
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/70 to-transparent text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold pr-2 flex-1">{restaurant.name}</h2>
                    <button 
                      onClick={(e) => handleInfoClick(e, restaurant.place_id)}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors flex-shrink-0"
                      aria-label={`View details for ${restaurant.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            i < safeRating
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
                    <span className="text-xs sm:text-sm opacity-90 ml-2">({safeRating.toFixed(1)})</span>
                  </div>
                  <p className="text-xs sm:text-sm opacity-90 mt-1 line-clamp-2">
                    {restaurant.address}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Popup */}
      {showMessage.visible && (
        <div 
          className={`fixed inset-0 flex items-center z-50 pointer-events-none ${
            showMessage.type === 'like' ? 'justify-end pr-8' : 'justify-start pl-8'
          }`}
          aria-live="polite"
          aria-atomic="true"
        >
          <div 
            className={`transform transition-all duration-300 ${
              showMessage.visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
          >
            <div
              className={`px-6 py-3 sm:px-8 sm:py-4 rounded-full text-white text-xl sm:text-2xl font-bold shadow-2xl ${
                showMessage.type === 'like' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {showMessage.type === 'like' ? '❤️ LIKED!' : '❌ NOPE!'}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!canSwipe && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/95 z-20">
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

      {/* Accessibility instructions */}
      <div className="sr-only">
        <p>Use left arrow to reject, right arrow to like, Enter or Space to view details</p>
      </div>
    </div>
  );
};

export default SwipeView; 