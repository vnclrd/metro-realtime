import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function App() {
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const navigate = useNavigate();

  const handleRedirect = async () => {
    if (!location.trim()) return
    
    try {
      setLoading(true);

      const response = await fetch('http://127.0.0.1:5000/save-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location }),
      });

      const data = await response.json();
      console.log('Saved Location:', data);

      // Navigate only after successful save
      if (response.ok) {
        navigate('/core');
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save location. Check your backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }
    
    setDetecting(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch('http://127.0.0.1:5000/reverse-geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude }),
          });

          const data = await response.json();

          if (response.ok) {
            setLocation(data.address);
          } else {
            alert(data.error || 'Failed to get address');
          }
        } catch (error) {
          console.error(error);
          alert('Failed to detect location. Please try again.');
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        console.error(error);
        setDetecting(false);
        alert('Unable to retrieve your location. Please check your browser permissions.')
      }
    )
  }

  return (
    <div className='flex w-full min-h-screen bg-[#009688] items-center justify-center p-4'>
      <div className='flex flex-col items-center justify-center w-full max-w-lg'>
        {/* Title */}
        <h1 className='text-3xl sm:text-3xl lg:text-[2.5rem] mb-5 text-[#e0e0e0] text-center'>
          Where are you located?
        </h1>

        {/* Input & Buttons */}
        <div className='flex w-full max-w-md items-center'>
          
          {/* Target Button */}
          <button
            onClick={handleDetectLocation}
            disabled={detecting}
            className={`flex items-center justify-center w-12 h-12 mr-2.5 rounded-full cursor-pointer transition shadow-[_0_2px_2px_rgba(0,0,0,0.5)] ${
              detecting
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#e0e0e0] hover:bg-gray-200'
            }`}
          >
            <img src='/target-icon.png' alt='Target Icon' className='w-6 h-6' />
          </button>

          {/* Input Field */}
          <input
            type='text'
            placeholder='Enter your location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className='flex-1 h-12 bg-[#e0e0e0] rounded-full pl-4 pr-4 mr-2.5 focus:outline-none focus:ring-2 focus:ring-[#00796b] shadow-[_0_2px_2px_rgba(0,0,0,0.5)]'
          />

          {/* Arrow Button */}
          <button
            onClick={handleRedirect}
            disabled={!location.trim() || loading}
            className={`flex items-center justify-center w-12 h-12 rounded-full transition shadow-[_0_2px_2px_rgba(0,0,0,0.5)] ${
              location.trim() && !loading
                ? 'bg-[#e0e0e0] hover:bg-gray-200 cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <img src='/arrow-icon.png' alt='Arrow Icon' className='w-5 h-5' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
