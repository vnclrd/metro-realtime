import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import customPinImage from '/custom-pin.png';

// Default marker icon
delete L.Icon.Default.prototype._getIconUrl;
const customPinIcon = L.icon({
  iconUrl: customPinImage,
  iconSize: [60, 60],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

// Improved MapResizer — keeps refreshing until map is fully drawn
function MapResizer({ center }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    let tries = 0;
    const maxTries = 10;

    function refreshMap() {
      if (!map) return;

      // Force Leaflet to redraw tiles
      map.invalidateSize();

      // Smoothly recenter map if center is provided
      if (center) {
        map.setView(center, map.getZoom(), { animate: true });
      }

      // Retry until tiles are fully loaded or max tries reached
      if (tries < maxTries) {
        tries++;
        setTimeout(refreshMap, 300);
      }
    }

    refreshMap();

    // Also refresh map on window resize
    const handleResize = () => {
      map.invalidateSize();
      if (center) map.setView(center, map.getZoom(), { animate: true });
    };
    window.addEventListener('resize', handleResize);

    // Refresh when page becomes visible again
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        map.invalidateSize();
        if (center) map.setView(center, map.getZoom(), { animate: true });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [map, center]);

  return null;
}

// Center marker button
function CenterButton({ markerPos }) {
  const map = useMap();
  
  const handleCenter = () => {
    if (map && markerPos) {
      map.setView(markerPos, map.getZoom(), { animate: true });
    }
  };

  return (
    <button
      onClick={handleCenter}
      className='absolute top-4 right-4 z-[1000] p-2 bg-white rounded-full shadow-lg border border-gray-300 cursor-pointer'
    >
      <img src='./target-icon.png' alt='Target Icon' className='w-[26px] h-auto' />
    </button>
  );
}

export default function LocationContent({ location, setLocation }) {
  const [markerPos, setMarkerPos] = useState(
    location?.lat && location?.lng ? [location.lat, location.lng] : null
  );

  const [currentZoom, setCurrentZoom] = useState(13);
  const [locationName, setLocationName] = useState(
    location?.name || 'Fetching your location...'
  );

  // Store the last valid position
  const lastValidPosition = useRef(null);
  const markerRef = useRef(null);

  // Get current location on mount
  useEffect(() => {
    if (!location?.lat || !location?.lng) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            const position = [lat, lng];
            setMarkerPos(position);
            lastValidPosition.current = position;

            // Get readable name using OpenStreetMap Nominatim API
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
              );
              const data = await res.json();
              const name =
                data.display_name || `Lat: ${lat}, Lng: ${lng}`;
              setLocationName(name);

              if (setLocation) {
                setLocation({ lat, lng, name });
              }
            } catch (err) {
              console.error('Error fetching location name:', err);
              setLocationName(`Lat: ${lat}, Lng: ${lng}`);
            }
          },
          (err) => {
            console.error('Geolocation error:', err);
            setLocationName('Unable to fetch your location.');
          }
        );
      } else {
        setLocationName('Geolocation is not supported by your browser.');
      }
    } else {
      // If location is provided, set it as the last valid position
      lastValidPosition.current = [location.lat, location.lng];
    }
  }, []);

  // When dragging the marker manually
  const handleDragEnd = async (e) => {
    const newLatLng = e.target.getLatLng();
    const newPosition = [newLatLng.lat, newLatLng.lng];

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${newLatLng.lat}&lon=${newLatLng.lng}`
      );
      const data = await res.json();
      const name = data.display_name || `Lat: ${newLatLng.lat}, Lng: ${newLatLng.lng}`;

      // Check if the location name contains 'Metro Manila' (case insensitive)
      const isValidLocation = name.toLowerCase().includes('metro manila');

      if (isValidLocation) {
        // Valid location - update everything
        setMarkerPos(newPosition);
        setLocationName(name);
        lastValidPosition.current = newPosition;

        if (setLocation) {
          setLocation({
            lat: newLatLng.lat,
            lng: newLatLng.lng,
            name,
          });
        }
      } else {
        // Invalid location - revert to last valid position
        if (lastValidPosition.current) {
          // Reset marker position to last valid position
          setMarkerPos([...lastValidPosition.current]);
          
          // If we have a reference to the marker, update its position
          if (markerRef.current) {
            markerRef.current.setLatLng(lastValidPosition.current);
          }
        }
        
        // Optional: Show a brief message to user about invalid location
        console.log('Invalid location: Must be within Metro Manila');
        // You could add a toast notification here if desired
      }
    } catch (err) {
      console.error('Error fetching location name:', err);
      
      // On error, also revert to last valid position
      if (lastValidPosition.current) {
        setMarkerPos([...lastValidPosition.current]);
        if (markerRef.current) {
          markerRef.current.setLatLng(lastValidPosition.current);
        }
      }
    }
  };

  return (
    <div className='flex flex-col w-full h-full'>
      {/* Header */}
      <div className='flex flex-col items-center justify-center mb-4 text-center'>
        <h1 className='text-[2rem] md:text-[2.5rem] font-bold'>Select Location</h1>
        <p className='text-md text-[#e0e0e0]'>Your current selected location is:
          <br />
          <span className='italic text-[#e0e0e0] text-md'>{locationName}</span></p>
      </div>

      {/* Map Container */}
      <div className='w-full h-[600px] sm:h-[400px] md:h-[500px] bg-[#009688] rounded-[25px] overflow-hidden relative'> {/* Add `relative` here */}
        {markerPos && (
          <MapContainer
            center={markerPos}
            zoom={currentZoom}
            style={{
              height: '100%',
              width: '100%',
              borderRadius: '20px',
            }}
          >
            {/* Tile Layer */}
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OSM</a>"
            />

            {/* Draggable Marker */}
            <Marker
              ref={markerRef}
              position={markerPos}
              draggable={true}
              eventHandlers={{
                dragend: handleDragEnd,
              }}
              icon={customPinIcon}
            >
              <Popup>
                {locationName || 'Drag marker to change location'}
              </Popup>
            </Marker>
            
            {/* Force Map Resize and Center Button */}
            <MapResizer />
            <CenterButton markerPos={markerPos} />
          </MapContainer>
        )}
      </div>
    </div>
  );
}