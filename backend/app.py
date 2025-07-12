from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app) # Allow all origins by default

# TODO: It is recommended to move the API key to an environment variable for production.
API_KEY = 'AIzaSyAnHQKt7EuXPbGQSuRKO6lfimnbkGlSbic'

# Google Places API (New) endpoints
NEARBY_SEARCH_URL = 'https://places.googleapis.com/v1/places:searchNearby'
PLACE_DETAILS_URL = 'https://places.googleapis.com/v1/places/'

# In-memory storage for liked restaurant place_ids
liked_restaurants = set()

@app.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({"error": "Latitude and longitude are required"}), 400

    try:
        lat = float(lat)
        lon = float(lon)
    except ValueError:
        return jsonify({"error": "Invalid latitude or longitude"}), 400

    # Build request for new Places API
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.rating,places.formattedAddress,places.photos"
    }

    body = {
        "includedTypes": ["restaurant"],
        "maxResultCount": 20,
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": lat,
                    "longitude": lon
                },
                "radius": 5000.0
            }
        }
    }

    try:
        resp = requests.post(NEARBY_SEARCH_URL, json=body, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        return jsonify({"error": f"Failed to fetch from Google Places API: {e}"}), 500

    restaurants = []
    for place in data.get('places', []):
        rating = place.get('rating', 0)
        photos = place.get('photos', [])
        if rating >= 4.0 and photos:
            photo_name = photos[0]['name']  # e.g., 'places/XYZ/photos/abc'
            photo_url = f"https://places.googleapis.com/v1/{photo_name}/media?key={API_KEY}&maxHeightPx=800&maxWidthPx=800"
            restaurants.append({
                "place_id": place.get('id'),
                "name": place.get('displayName', {}).get('text', 'Unknown'),
                "rating": rating,
                "image_url": photo_url,
                "address": place.get('formattedAddress', 'No address available')
            })

    return jsonify(restaurants)

@app.route('/api/restaurant/<place_id>', methods=['GET'])
def get_restaurant_details(place_id):
    if not place_id:
        return jsonify({"error": "Place ID is required"}), 400
    
    try:
        headers = {
            "X-Goog-Api-Key": API_KEY,
            "X-Goog-FieldMask": "displayName,rating,formattedAddress,internationalPhoneNumber,websiteUri,editorialSummary,photos"
        }
        url = f"{PLACE_DETAILS_URL}{place_id}"
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
        result = resp.json()

        description = result.get('editorialSummary', {}).get('text', '')

        response = {
            "name": result.get('displayName', {}).get('text', 'Unknown'),
            "rating": result.get('rating'),
            "phone": result.get('internationalPhoneNumber'),
            "website": result.get('websiteUri'),
            "description": description.strip()
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/like', methods=['POST'])
def like_restaurant():
    data = request.get_json()
    place_id = data.get('place_id')
    
    if place_id is None:
        return jsonify({"error": "place_id is required"}), 400
    
    liked_restaurants.add(place_id)
    return jsonify({"status": "success", "message": f"Restaurant {place_id} liked"})

@app.route('/api/liked-restaurants', methods=['GET'])
def get_liked_restaurants():
    liked_list = []
    for place_id in liked_restaurants:
        try:
            headers = {
                "X-Goog-Api-Key": API_KEY,
                "X-Goog-FieldMask": "displayName,rating,formattedAddress,photos"
            }
            url = f"{PLACE_DETAILS_URL}{place_id}"
            resp = requests.get(url, headers=headers, timeout=10)
            resp.raise_for_status()
            place = resp.json()

            photos = place.get('photos', [])
            photo_url = ''
            if photos:
                photo_name = photos[0]['name']
                photo_url = f"https://places.googleapis.com/v1/{photo_name}/media?key={API_KEY}&maxHeightPx=800&maxWidthPx=800"

            liked_list.append({
                "place_id": place_id,
                "name": place.get('displayName', {}).get('text', 'Unknown'),
                "rating": place.get('rating', 'N/A'),
                "image_url": photo_url,
                "address": place.get('formattedAddress', 'No address available')
            })
        except Exception as e:
            # In case a place becomes invalid, skip it
            print(f"Could not fetch details for {place_id}: {e}")
            continue

    return jsonify(liked_list)

if __name__ == '__main__':
    app.run(debug=True, port=5050) 