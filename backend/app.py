from flask import Flask, request, jsonify
from flask_cors import CORS
from geopy.geocoders import Nominatim

# Imports for file and information saving
from flask import send_from_directory
import os
import json
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) # resources for testing

geolocator = Nominatim(user_agent="location_app")

# Configuration for file uploads and data storage
UPLOAD_FOLDER = 'uploads/images'
DATA_FILE = 'data/reports.json'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('data', exist_ok=True)

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

# FILE SAVING COMPONENTS
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_reports():
    """Load reports from JSON file"""
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_reports(reports):
    """Save reports to JSON file"""
    with open(DATA_FILE, 'w') as f:
        json.dump(reports, f, indent=2)

# FILE SAVING COMPONENTS
@app.route('/api/reports', methods=['POST'])
def create_report():
    try:
        # Handle image upload
        image_filename = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '' and allowed_file(file.filename):
                # Generate unique filename
                file_extension = file.filename.rsplit('.', 1)[1].lower()
                image_filename = f"{uuid.uuid4()}.{file_extension}"
                file.save(os.path.join(UPLOAD_FOLDER, image_filename))

        # Get form data
        issue_type = request.form.get('issueType', '')
        custom_issue = request.form.get('customIssue', '')
        description = request.form.get('description', '')
        location_name = request.form.get('location', '')
        location_lat = request.form.get('latitude', '')
        location_lng = request.form.get('longitude', '')

        # Create report object
        report = {
            'id': str(uuid.uuid4()),
            'timestamp': datetime.now().isoformat(),
            'issue_type': issue_type,
            'custom_issue': custom_issue if issue_type == 'custom' else '',
            'description': description,
            'location': location_name,
            'latitude': float(location_lat) if location_lat else None,
            'longitude': float(location_lng) if location_lng else None,
            'image_filename': image_filename,
            'status': 'pending'
        }

        # Load existing reports and add new one
        reports = load_reports()
        reports.append(report)
        save_reports(reports)

        return jsonify({
            'success': True,
            'message': 'Report submitted successfully',
            'report_id': report['id']
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error submitting report: {str(e)}'
        }), 500

@app.route('/api/reports', methods=['GET'])
def get_reports():
    """Get all reports with optional filtering"""
    try:
        reports = load_reports()
        
        # Optional filtering by status
        status_filter = request.args.get('status')
        if status_filter:
            reports = [r for r in reports if r.get('status') == status_filter]
        
        # Sort by timestamp (newest first)
        reports.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return jsonify({
            'success': True,
            'reports': reports,
            'total': len(reports)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching reports: {str(e)}'
        }), 500

@app.route('/api/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    """Get a specific report by ID"""
    try:
        reports = load_reports()
        report = next((r for r in reports if r['id'] == report_id), None)
        
        if not report:
            return jsonify({
                'success': False,
                'message': 'Report not found'
            }), 404
        
        return jsonify({
            'success': True,
            'report': report
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching report: {str(e)}'
        }), 500

@app.route('/api/reports/<report_id>', methods=['PUT'])
def update_report_status(report_id):
    """Update report status"""
    try:
        data = request.get_json()
        new_status = data.get('status')
        
        if new_status not in ['pending', 'in_progress', 'resolved']:
            return jsonify({
                'success': False,
                'message': 'Invalid status'
            }), 400
        
        reports = load_reports()
        report = next((r for r in reports if r['id'] == report_id), None)
        
        if not report:
            return jsonify({
                'success': False,
                'message': 'Report not found'
            }), 404
        
        report['status'] = new_status
        report['updated_at'] = datetime.now().isoformat()
        save_reports(reports)
        
        return jsonify({
            'success': True,
            'message': 'Report status updated successfully'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating report: {str(e)}'
        }), 500

@app.route('/api/reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    """Delete a report"""
    try:
        reports = load_reports()
        report = next((r for r in reports if r['id'] == report_id), None)
        
        if not report:
            return jsonify({
                'success': False,
                'message': 'Report not found'
            }), 404
        
        # Delete associated image file
        if report.get('image_filename'):
            image_path = os.path.join(UPLOAD_FOLDER, report['image_filename'])
            if os.path.exists(image_path):
                os.remove(image_path)
        
        # Remove report from list
        reports = [r for r in reports if r['id'] != report_id]
        save_reports(reports)
        
        return jsonify({
            'success': True,
            'message': 'Report deleted successfully'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error deleting report: {str(e)}'
        }), 500

@app.route('/api/images/<filename>')
def serve_image(filename):
    """Serve uploaded images"""
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(port=5000, debug=True, use_reloader=False)
