import React, { useState } from 'react';

function Reports() {
  // Use state to track which div is currently active.
  const [activeDiv, setActiveDiv] = useState('div1');

  // Define the common, active, and inactive classes for the buttons.
  // This makes the code cleaner and easier to read.
  const baseButtonClasses = 'flex flex-col items-center justify-center w-[25%] h-[75px] cursor-pointer';

  return (
    <div className='flex flex-col w-full min-h-screen'>

      {/* Header */}
      <header className='fixed w-full h-[100px] top-0 bg-[#008377]'>
        <img src="/public/ulat-ph-logo-2.png" alt="Ulat PH Logo 2" className='w-[125px] h-auto m-5' />
      </header>

      {/* Reports Page Content */}
      <div
        className={`flex-1 flex items-center justify-center p-4 mt-[75px] mb-[100px] ${
          activeDiv === 'div1' ? 'bg-[#009688]' : 'hidden'
        }`}
      >
        <h1 className='text-white text-3xl'>Reports Page</h1>
      </div>

      {/* Location Page Content */}
      <div
        className={`flex-1 flex items-center justify-center p-4 mt-[75px] mb-[100px] ${
          activeDiv === 'div2' ? 'bg-[#009688]' : 'hidden'
        }`}
      >
        <h1 className='text-white text-3xl'>Location Page</h1>
      </div>

      {/* Make a Report Page Content */}
      <div
        className={`flex-1 flex items-center justify-center p-4 mt-[75px] mb-[100px] ${
          activeDiv === 'div3' ? 'bg-[#009688]' : 'hidden'
        }`}
      >
        <h1 className='text-white text-3xl'>Make Report Page</h1>
      </div>

      {/* Settings Page Content */}
      <div
        className={`flex-1 flex items-center justify-center p-4 mt-[75px] mb-[100px] ${
          activeDiv === 'div4' ? 'bg-[#009688]' : 'hidden'
        }`}
      >
        <h1 className='text-white text-3xl'>Settings Page</h1>
      </div>

      {/* Footer */}
      <footer className='fixed flex justify-around items-center w-full h-[100px] bottom-0 bg-[#008377] p-10'>
        
        {/* Reports Button with Conditional Styles */}
        <button
          className={`${baseButtonClasses} ${
            activeDiv === 'div1' 
              ? 'bg-[#006057] text-white rounded-[15px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]' 
              : 'bg-transparent text-[#e0e0e0]'
          }`}
          onClick={() => setActiveDiv('div1')}
        >
          <img
            src='/public/reports-icon.png'
            alt='Reports Icon'
            className='w-[30px] h-[30px] filter invert'
          />
          <p className='font-light text-sm mt-[3px]'>Reports</p>
        </button>

        {/* Location Button with Conditional Styles */}
        <button
          className={`${baseButtonClasses} ${
            activeDiv === 'div2' 
              ? 'bg-[#006057] text-white rounded-[15px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]' 
              : 'bg-transparent text-[#e0e0e0]'
          }`}
          onClick={() => setActiveDiv('div2')}
        >
          <img
            src='/public/location-icon.png'
            alt='Location Icon'
            className='w-[30px] h-[30px] filter invert'
          />
          <p className='font-light text-sm mt-[3px]'>Location</p>
        </button>

        {/* Make Report Button with Conditional Styles */}
        <button
          className={`${baseButtonClasses} ${
            activeDiv === 'div3' 
              ? 'bg-[#006057] text-white rounded-[15px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]' 
              : 'bg-transparent text-[#e0e0e0]'
          }`}
          onClick={() => setActiveDiv('div3')}
        >
          <img
            src='/public/make-report-icon.png'
            alt='Make Report Icon'
            className='w-[30px] h-[30px] filter invert'
          />
          <p className='font-light text-sm mt-[3px]'>Make Report</p>
        </button>

        {/* Settings Button with Conditional Styles */}
        <button
          className={`${baseButtonClasses} ${
            activeDiv === 'div4' 
              ? 'bg-[#006057] text-white rounded-[15px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]' 
              : 'bg-transparent text-[#e0e0e0]'
          }`}
          onClick={() => setActiveDiv('div4')}
        >
          <img
            src='/public/settings-icon.png'
            alt='Settings Icon'
            className='w-[30px] h-[30px] filter invert'
          />
          <p className='font-light text-sm mt-[3px]'>Settings</p>
        </button>
      </footer>
    </div>
  );
}

export default Reports;
