import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Simplified MapResizer — only refreshes map size
function MapResizer() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Force Leaflet to redraw tiles
    map.invalidateSize();

    // Refresh map on window resize
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    // Refresh when page becomes visible again
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        map.invalidateSize();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [map]);

  return null;
}

export default function LocationContent({ location, setLocation }) {
  const [markerPos, setMarkerPos] = useState(
    location?.lat && location?.lng ? [location.lat, location.lng] : null
  );
  // Store the previous valid position
  const previousMarkerPosRef = useRef(markerPos);

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

              // Check if initial location is in Metro Manila
              if (name.toLowerCase().includes('metro manila')) {
                setLocationName(name);
                if (setLocation) {
                  setLocation({ lat, lng, name });
                }
              } else {
                console.warn('Initial location is not in Metro Manila.');
                setLocationName('Initial location is not in Metro Manila.');
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

      // Check if the location name contains "Metro Manila" (case insensitive)
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
        <p className='text-md text-[#e0e0e0] italic text-md'>{locationName}</p>
      </div>

      {/* Map Container */}
      <div className='w-full h-[600px] sm:h-[400px] md:h-[500px] bg-[#009688] rounded-[25px] overflow-hidden'>
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
            >
              <Popup>
                {locationName || 'Drag marker to change location'}
              </Popup>
            </Marker>

            {/* Force Map Resize */}
            <MapResizer />
          </MapContainer>
        )}
      </div>
    </div>
  );
}