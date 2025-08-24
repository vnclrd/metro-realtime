from flask import Flask, request, jsonify
from flask_cors import CORS
from geopy.geocoders import Nominatim

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) # resources for testing

geolocator = Nominatim(user_agent="location_app")

@app.route('/')
def home():
    return 'Hello, World!'

# Automatic detect current location
@app.route('/reverse-geocode', methods=['POST'])
def reverse_geocode():
    data = request.get_json()
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    if latitude is None or longitude is None:
        return jsonify({'error': 'Latitude and longitude are required'}), 400

    try:
        location = geolocator.reverse((latitude, longitude), language='en')
        if not location:
            return jsonify({'error': 'Unable to get address'}), 400

        address = location.address
        return jsonify({'address': address}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Manual entering of location
@app.route('/save-location', methods=['POST'])
def save_location():
    data = request.get_json()
    location_name = data.get('location')
    print('Received location:', location_name, flush=True)

    if not location_name:
        return jsonify({'error': 'Location is required'}), 400

    try:
        # Get coordinates from location name
        location = geolocator.geocode(location_name)
        if not location:
            return jsonify({'error': 'Invalid location'}), 400

        location_data = {
            'name': location_name,
            'latitude': location.latitude,
            'longitude': location.longitude
        }

        print("Saved location:", location_data, flush=True)
        return jsonify({'message': 'Location saved successfully', 'data': location_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True, use_reloader=False)
