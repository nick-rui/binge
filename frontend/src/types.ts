export interface Restaurant {
  id: number;
  name: string;
  dish: string;
  price: string;
  image_url: string;
}

export type Direction = 'left' | 'right';

export interface SwipeProps {
  restaurant: Restaurant;
  onSwipe: (direction: Direction) => void;
} 