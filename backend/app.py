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
GEOCODING_URL = 'https://maps.googleapis.com/maps/api/geocode/json'

# In-memory storage for liked restaurant place_ids
liked_restaurants = set()

@app.route('/api/geocode', methods=['GET'])
def geocode_location():
    """Convert a location name/address to coordinates"""
    address = request.args.get('address')
    
    if not address:
        return jsonify({"error": "Address parameter is required"}), 400
    
    try:
        params = {
            'address': address,
            'key': API_KEY
        }
        
        resp = requests.get(GEOCODING_URL, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        
        if data['status'] != 'OK' or not data.get('results'):
            return jsonify({"error": "Location not found"}), 404
        
        result = data['results'][0]
        location = result['geometry']['location']
        
        return jsonify({
            "lat": location['lat'],
            "lon": location['lng'],
            "formatted_address": result['formatted_address'],
            "place_id": result.get('place_id'),
            "types": result.get('types', [])
        })
        
    except Exception as e:
        return jsonify({"error": f"Geocoding failed: {e}"}), 500

@app.route('/api/search-locations', methods=['GET'])
def search_locations():
    """Search for location suggestions based on query"""
    query = request.args.get('query')
    
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    
    try:
        # Use Places API Text Search for location suggestions
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": API_KEY,
            "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.types"
        }
        
        body = {
            "textQuery": query,
            "includedTypes": ["locality", "administrative_area_level_1", "country"],
            "maxResultCount": 5
        }
        
        # Use the text search endpoint for location suggestions
        resp = requests.post('https://places.googleapis.com/v1/places:searchText', 
                           json=body, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        
        suggestions = []
        for place in data.get('places', []):
            suggestions.append({
                "place_id": place.get('id'),
                "name": place.get('displayName', {}).get('text', 'Unknown'),
                "formatted_address": place.get('formattedAddress', ''),
                "types": place.get('types', [])
            })
        
        return jsonify(suggestions)
        
    except Exception as e:
        return jsonify({"error": f"Location search failed: {e}"}), 500

@app.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    """Get restaurants by coordinates (supports both lat/lon and location name)"""
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    location_name = request.args.get('location')

    # If location name is provided, geocode it first
    if location_name and not (lat and lon):
        try:
            params = {
                'address': location_name,
                'key': API_KEY
            }
            
            resp = requests.get(GEOCODING_URL, params=params, timeout=10)
            resp.raise_for_status()
            geocode_data = resp.json()
            
            if geocode_data['status'] != 'OK' or not geocode_data.get('results'):
                return jsonify({"error": "Could not find the specified location"}), 404
            
            result = geocode_data['results'][0]
            location_coords = result['geometry']['location']
            lat = location_coords['lat']
            lon = location_coords['lng']
            
        except Exception as e:
            return jsonify({"error": f"Failed to geocode location: {e}"}), 500

    # Validate coordinates
    if not lat or not lon:
        return jsonify({"error": "Latitude and longitude are required (or provide location name)"}), 400

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

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for testing"""
    return jsonify({"status": "healthy", "message": "Backend is running"})

if __name__ == '__main__':
    app.run(debug=True, port=5050) 