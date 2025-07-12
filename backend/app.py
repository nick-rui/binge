from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Mock database of restaurants
restaurants = [
    {
        "id": 1,
        "name": "Sushi Paradise",
        "dish": "Dragon Roll Deluxe",
        "price": "$24.99",
        "image_url": "https://placehold.co/600x800/67B7D1/ffffff?text=Dragon+Roll"
    },
    {
        "id": 2,
        "name": "Burger Haven",
        "dish": "Truffle Mushroom Burger",
        "price": "$18.99",
        "image_url": "https://placehold.co/600x800/D1A667/ffffff?text=Truffle+Burger"
    },
    {
        "id": 3,
        "name": "Pizza Roma",
        "dish": "Margherita Pizza",
        "price": "$16.99",
        "image_url": "https://placehold.co/600x800/D16767/ffffff?text=Margherita"
    },
    {
        "id": 4,
        "name": "Thai Spice",
        "dish": "Pad Thai",
        "price": "$15.99",
        "image_url": "https://placehold.co/600x800/67D196/ffffff?text=Pad+Thai"
    },
    {
        "id": 5,
        "name": "Mediterranean Delight",
        "dish": "Lamb Shawarma Plate",
        "price": "$21.99",
        "image_url": "https://placehold.co/600x800/9667D1/ffffff?text=Shawarma"
    },
    {
        "id": 6,
        "name": "Taco Fiesta",
        "dish": "Street Tacos Trio",
        "price": "$12.99",
        "image_url": "https://placehold.co/600x800/D167C4/ffffff?text=Tacos"
    },
    {
        "id": 7,
        "name": "Pho House",
        "dish": "Special Beef Pho",
        "price": "$14.99",
        "image_url": "https://placehold.co/600x800/67D1C4/ffffff?text=Pho"
    },
    {
        "id": 8,
        "name": "Indian Curry House",
        "dish": "Butter Chicken",
        "price": "$19.99",
        "image_url": "https://placehold.co/600x800/D19667/ffffff?text=Curry"
    },
    {
        "id": 9,
        "name": "Ramen Lab",
        "dish": "Tonkotsu Ramen",
        "price": "$17.99",
        "image_url": "https://placehold.co/600x800/6796D1/ffffff?text=Ramen"
    },
    {
        "id": 10,
        "name": "BBQ Joint",
        "dish": "Smoked Brisket Plate",
        "price": "$26.99",
        "image_url": "https://placehold.co/600x800/D16767/ffffff?text=BBQ"
    }
]

# In-memory storage for liked restaurants
liked_restaurants = set()

@app.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    # Return a shuffled copy of the restaurants list
    shuffled_restaurants = restaurants.copy()
    random.shuffle(shuffled_restaurants)
    return jsonify(shuffled_restaurants)

@app.route('/api/like', methods=['POST'])
def like_restaurant():
    data = request.get_json()
    restaurant_id = data.get('restaurant_id')
    
    if restaurant_id is None:
        return jsonify({"error": "restaurant_id is required"}), 400
    
    liked_restaurants.add(restaurant_id)
    return jsonify({"status": "success", "message": f"Restaurant {restaurant_id} liked"})

@app.route('/api/liked-restaurants', methods=['GET'])
def get_liked_restaurants():
    # Return full restaurant objects for all liked restaurant IDs
    liked_list = [r for r in restaurants if r['id'] in liked_restaurants]
    return jsonify(liked_list)

if __name__ == '__main__':
    app.run(debug=True, port=5000) 