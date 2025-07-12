import type { RestaurantDetails } from '../types';

interface RestaurantDetailModalProps {
  restaurant: RestaurantDetails;
  onClose: () => void;
}

const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({ restaurant, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
        {restaurant.description && <p className="text-gray-700 mb-4">{restaurant.description}</p>}
        {restaurant.phone && <p className="text-gray-600"><strong>Phone:</strong> {restaurant.phone}</p>}
        {restaurant.website && <p className="text-gray-600"><strong>Website:</strong> <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600">{restaurant.website}</a></p>}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RestaurantDetailModal; 