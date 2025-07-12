export type Direction = 'left' | 'right' | 'up' | 'down';

export interface Restaurant {
  place_id: string;
  name: string;
  rating: number;
  image_url: string;
  address: string;
}

export interface RestaurantDetails extends Restaurant {
  phone?: string;
  website?: string;
  description?: string;
} 