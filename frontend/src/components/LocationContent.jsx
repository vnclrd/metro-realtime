import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
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

export default function LocationContent({ location, setLocation }) {
  const [markerPos, setMarkerPos] = useState(
    location?.lat && location?.lng ? [location.lat, location.lng] : null
  );

  const [currentZoom, setCurrentZoom] = useState(13);
  const [locationName, setLocationName] = useState(
    location?.name || 'Fetching your location...'
  );

  // Get current location on mount
  useEffect(() => {
    if (!location?.lat || !location?.lng) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setMarkerPos([lat, lng]);

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
    }
  }, []);

  // When dragging the marker manually
  const handleDragEnd = async (e) => {
    const newLatLng = e.target.getLatLng();
    setMarkerPos([newLatLng.lat, newLatLng.lng]);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${newLatLng.lat}&lon=${newLatLng.lng}`
      );
      const data = await res.json();
      const name =
        data.display_name || `Lat: ${newLatLng.lat}, Lng: ${newLatLng.lng}`;
      setLocationName(name);

      if (setLocation) {
        setLocation({
          lat: newLatLng.lat,
          lng: newLatLng.lng,
          name,
        });
      }
    } catch (err) {
      console.error('Error fetching location name:', err);
      setLocationName(`Lat: ${newLatLng.lat}, Lng: ${newLatLng.lng}`);
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
