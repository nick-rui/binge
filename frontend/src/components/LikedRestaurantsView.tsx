import { Restaurant } from '../types';

interface LikedRestaurantsViewProps {
  restaurants: Restaurant[];
}

const LikedRestaurantsView: React.FC<LikedRestaurantsViewProps> = ({ restaurants }) => {
  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-700">
          No liked restaurants yet!
        </h3>
        <p className="text-gray-500 mt-2">
          Start swiping to discover and save your favorite places.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <div
          key={restaurant.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
        >
          <img
            src={restaurant.image_url}
            alt={restaurant.dish}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {restaurant.name}
            </h3>
            <p className="text-gray-600 mt-1">{restaurant.dish}</p>
            <p className="text-indigo-600 font-semibold mt-2">
              {restaurant.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LikedRestaurantsView; 