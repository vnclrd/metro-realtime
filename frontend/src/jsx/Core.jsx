import React, { useState } from 'react'

function Core() {
  // Use state to track which div is currently active.
  const [activeDiv, setActiveDiv] = useState('div1')
  const baseButtonClassesFooter = 'flex flex-col items-center justify-center w-[25%] h-[60px] cursor-pointer'

  return (
    <div className='flex flex-col w-full min-h-screen bg-[#009688]'>

      {/* Header */}
      <header className='fixed flex w-full h-[75px] top-0 bg-[#008377]'>
        <img src="/public/ulat-ph-logo.png" alt="Ulat PH Logo 2" className='w-[50px] m-2.5 ml-10' />
        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-[1.5rem] text-[#e0e0e0] font-bold'>Ulat PH</h1>
          <p className='text-[0.9rem] text-[#e0e0e0] font-light mt-[-5px]'>iulat mo na!</p>
        </div>
        
      </header>


      {/* Left Panel */}
      <div className='w-[50%] h-screen mt-[75px] bg-white'>



      </div>











      {/* Reports Page Content */}
      <div
        className={`flex flex-col mt-[75px] mb-[100px] ${
          activeDiv === 'div1' ? 'bg-[#009688]' : 'hidden'
        }`}
      >
        <div className='flex'>
          {/* Left Panel */}

          {/*
            <div className='w-[50%] h-[350px] bg-[#009688] rounded-[15px]'>
              <h1 className='text-[2rem] text-[#e0e0e0] pl-10 mt-10'>Reports</h1>
              <div class="flex pl-10">
                <div class="flex flex-col w-[50%] h-[350px] gap-5 mt-10 pr-5 overflow-y-scroll rounded-lg">
                  <div class="w-full h-[75px] rounded-[25px] bg-[#008C7F] flex-shrink-0"></div>
                  <div class="w-full h-[75px] rounded-[25px] bg-[#008C7F] flex-shrink-0"></div>
                  <div class="w-full h-[75px] rounded-[25px] bg-[#008C7F] flex-shrink-0"></div>
                  <div class="w-full h-[75px] rounded-[25px] bg-[#008C7F] flex-shrink-0"></div>
                  <div class="w-full h-[75px] rounded-[25px] bg-[#008C7F] flex-shrink-0"></div>
                  <div class="w-full h-[75px] rounded-[25px] bg-[#008C7F] flex-shrink-0"></div>
                  <div class="w-full h-[75px] rounded-[25px] bg-[#008C7F] flex-shrink-0"></div>
                </div>
              </div>
            </div>
          */}

          {/* Right Panel 
          <div className='w-[50%] h-[350px] bg-[#fff] rounded-[25px]'></div>
          */}

        </div>
          

        

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
      <footer className='fixed flex justify-around items-center w-full h-[75px] bottom-0 bg-[#008377] p-10'>
        
        {/* Reports Button */}
        <button
          className={`${baseButtonClassesFooter} ${
            activeDiv === 'div1' 
              ? 'bg-[#006057] text-white rounded-[15px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]' 
              : 'bg-transparent text-[#e0e0e0]'
          }`}
          onClick={() => setActiveDiv('div1')}
        >
          <img src='/public/reports-icon.png' alt='Reports Icon' className='w-[25px] h-[25px] filter invert' />
          <p className='font-light text-sm mt-[1px]'>Reports</p>
        </button>

        {/* Location Button */}
        <button
          className={`${baseButtonClassesFooter} ${
            activeDiv === 'div2' 
              ? 'bg-[#006057] text-white rounded-[15px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]' 
              : 'bg-transparent text-[#e0e0e0]'
          }`}
          onClick={() => setActiveDiv('div2')}
        >
          <img src='/public/location-icon.png' alt='Location Icon' className='w-[25px] h-[25px] filter invert' />
          <p className='font-light text-sm mt-[1px]'>Location</p>
        </button>

        {/* Make Report Button */}
        <button
          className={`${baseButtonClassesFooter} ${
            activeDiv === 'div3' 
              ? 'bg-[#006057] text-white rounded-[15px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]' 
              : 'bg-transparent text-[#e0e0e0]'
          }`}
          onClick={() => setActiveDiv('div3')}
        >
          <img src='/public/make-report-icon.png' alt='Make Report Icon' className='w-[25px] h-[25px] filter invert' />
          <p className='font-light text-sm mt-[1px]'>Make Report</p>
        </button>

        {/* Settings Button */}
        <button
          className={`${baseButtonClassesFooter} ${
            activeDiv === 'div4' 
              ? 'bg-[#006057] text-white rounded-[15px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]' 
              : 'bg-transparent text-[#e0e0e0]'
          }`}
          onClick={() => setActiveDiv('div4')}
        >
          <img src='/public/settings-icon.png' alt='Settings Icon' className='w-[25px] h-[25px] filter invert' />
          <p className='font-light text-sm mt-[1px]'>Settings</p>
        </button>
      </footer>
    </div>
  )
}

export default Core
