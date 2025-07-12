export interface Restaurant {
  id: number;
  name: string;
  dish: string;
  price: string;
  image_url: string;
  description: string;
  rating: number;
  cuisine: string;
}

export type Direction = 'left' | 'right';

// Mock data for development
export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: "Sushi Paradise",
    dish: "Dragon Roll Deluxe",
    price: "$24.99",
    description: "Premium sushi roll with fresh eel, avocado, and tempura shrimp",
    rating: 4.8,
    cuisine: "Japanese",
    image_url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    id: 2,
    name: "Burger Haven",
    dish: "Truffle Mushroom Burger",
    price: "$18.99",
    description: "Wagyu beef patty with truffle aioli and sautéed wild mushrooms",
    rating: 4.6,
    cuisine: "American",
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    id: 3,
    name: "Pizza Roma",
    dish: "Truffle Burrata Pizza",
    price: "$26.99",
    description: "Wood-fired pizza with fresh burrata, truffle oil, and arugula",
    rating: 4.7,
    cuisine: "Italian",
    image_url: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    id: 4,
    name: "Thai Spice",
    dish: "Tom Yum Seafood",
    price: "$22.99",
    description: "Spicy and sour soup with fresh seafood and aromatic herbs",
    rating: 4.5,
    cuisine: "Thai",
    image_url: "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    id: 5,
    name: "Mediterranean Delight",
    dish: "Mixed Grill Platter",
    price: "$32.99",
    description: "Assortment of grilled meats with saffron rice and hummus",
    rating: 4.9,
    cuisine: "Mediterranean",
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  }
]; 