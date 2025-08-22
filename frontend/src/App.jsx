import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/core');
  };

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
          <button className='flex items-center justify-center w-12 h-12 bg-[#e0e0e0] mr-2.5 rounded-full cursor-pointer hover:bg-gray-200 transition shadow-[_0_2px_2px_rgba(0,0,0,0.5)]'>
            <img
              src='/target-icon.png'
              alt='Target Icon'
              className='w-6 h-6'
            />
          </button>

          {/* Input Field */}
          <input
            type='text'
            placeholder='Enter your location'
            className='flex-1 h-12 bg-[#e0e0e0] rounded-full pl-4 mr-2.5 focus:outline-none focus:ring-2 focus:ring-[#00796b] shadow-[_0_2px_2px_rgba(0,0,0,0.5)]'
          />

          {/* Arrow Button */}
          <button
            onClick={handleRedirect}
            className='flex items-center justify-center w-12 h-12 bg-[#e0e0e0] rounded-full cursor-pointer hover:bg-gray-200 transition shadow-[_0_2px_2px_rgba(0,0,0,0.5)]'
          >
            <img
              src='/arrow-icon.png'
              alt='Arrow Icon'
              className='w-5 h-5'
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
