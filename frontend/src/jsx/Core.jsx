import React, { useState } from 'react'

function Core() {
  // Use state to track which div is currently active
  const [activeDiv, setActiveDiv] = useState('div1')
  const baseButtonClassesFooter = 'flex flex-col items-center justify-center w-[25%] h-[60px] cursor-pointer'

  return (
    <div className='flex flex-col w-full min-h-screen bg-[#009688]'>

      {/* ================================================== Header Content ================================================== */}

      {/* Header */}
      <header className='fixed flex w-full h-[75px] top-0 bg-[#008377]'>
        <img src='/ulat-ph-logo.png' alt='Ulat PH Logo 2' className='w-[50px] m-2.5 ml-5' />
        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-[1.5rem] text-[#e0e0e0] font-bold'>Ulat PH</h1>
          <p className='text-[0.9rem] text-[#e0e0e0] font-light mt-[-5px]'>iulat mo na!</p>
        </div>
        
      </header>

      {/* ================================================== Reports Page Content ================================================== */}

      <div
        className={`flex flex-col min-h-screen items-center justify-center ${
          activeDiv === 'div1' ? 'bg-[#009688]' : 'hidden'
        }`}
      >

        {/* Panels */}
        <div className='
          flex items-center justify-between w-auto ml-5 mr-5 gap-5 rounded-[15px] bg-[#008c7f] p-5
          
          '
        >

          {/* Left Panel */}
          <div className='flex flex-col w-[50%] h-[500px]'>

            <div className='flex flex-col items-center'>
              <h1 className='text-[2.5rem] text-[#e0e0e0] font-bold'>Reports</h1>

              <p className='text-[0.85rem] text-[#e0e0e0] mb-5'>
                near <span className='italic'>242 D, A. Bonifacio Street</span>
              </p>
            </div>

            {/* Reports Container */}
            <div className='flex items-center justify-center'>
              <div className='flex flex-col w-[100%] h-[400px] pr-5 gap-5 overflow-y-scroll rounded-lg
              scrollbar scrollbar-thin scrollbar-thumb-[#008c7f] scrollbar-track-[#e0e0e0]'>
                <div className='w-full h-[75px] rounded-[25px] bg-[#00786d] flex-shrink-0'></div>
                <div className='w-full h-[75px] rounded-[25px] bg-[#00786d] flex-shrink-0'></div>
                <div className='w-full h-[75px] rounded-[25px] bg-[#00786d] flex-shrink-0'></div>
                <div className='w-full h-[75px] rounded-[25px] bg-[#00786d] flex-shrink-0'></div>
                <div className='w-full h-[75px] rounded-[25px] bg-[#00786d] flex-shrink-0'></div>
                <div className='w-full h-[75px] rounded-[25px] bg-[#00786d] flex-shrink-0'></div>
                <div className='w-full h-[75px] rounded-[25px] bg-[#00786d] flex-shrink-0'></div>
              </div>
            </div>

          </div>

          {/* Right Panel */}
          <div className='flex items-center justify-center w-[50%] h-[500px]'>

            <div className='flex flex-col w-[100%] h-full bg-[#008c7f] rounded-[15px] gap-5'>

              {/* Image Holder */}
              <div className='w-full h-[50%] rounded-[15px] bg-[#009688]'>
                <img src='/pothole.png' alt='Photo of report' className='w-full h-full object-contain rounded-[15px]' />
              </div>

              {/* Description of report */}
              <div className='w-full h-[50%] bg-[#00786d] rounded-[15px] text-[#e0e0e0] overflow-y-scroll pl-5 pr-5 pt-3 pb-3'>
                <p>
                  Nakakainis na po talaga! Ang dami-dami nang butas dito sa kalsada namin.
                  Ilang buwan na po naming tiniis ‘to, pero hanggang ngayon wala pa ring ginagawa.
                  Araw-araw may nadadapa o muntik maaksidente dahil dito. Hindi na po ito ligtas!
                  Sana naman po ay may kumilos na agad bago may masaktan nang seryoso
                </p>
              </div>

              {/* 'I see this too' Button */}
              <button className='flex items-center justify-center w-full h-[50px] bg-[#00786d] text-[#e0e0e0] rounded-[15px] cursor-pointer shadow-[_0_2px_2px_rgba(0,0,0,0.5)]'>
                <img src='/vision-icon.png' alt='Vision Icon' className='w-[40px] h-[40px] filter invert m-3' />
                I see this too
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ================================================== Location Page Content ================================================== */}

      <div
        className={`flex flex-col min-h-screen items-center justify-center ${
          activeDiv === 'div2' ? 'bg-[#009688]' : 'hidden'
        }`}
      >

        {/* Page Titles */}
        <div className='flex flex-col w-full h-full items-center justify-center mb-5'>
          <h1 className='text-[2.5rem] text-[#e0e0e0] font-bold'>Select Location</h1>
          <p className='text-[1rem] text-[#e0e0e0] italic'>242 D, A. Bonifacio Street</p>
        </div>

        {/* Maps container */}
        <div className='flex items-center justify-center w-[1000px] h-[400px] bg-[#008C7F] rounded-[25px] text-[#e0e0e0]'>Google Maps API goes here</div>

      </div>

      {/* ================================================== Make Report Page Content ================================================== */}

      <div
        className={`flex-1 flex min-h-screen items-center justify-center ${
          activeDiv === 'div3' ? 'bg-[#009688]' : 'hidden'
        }`}
      >
        
        <div className='flex flex-col w-full h-full items-center justify-center'>

          <div className='flex flex-col items-center justify-center w-[100%] mb-5'>
            <h1 className='text-[2rem] text-[#e0e0e0] font-bold'>Report an Issue</h1>
            <p className='text-[0.8rem] text-[#e0e0e0]'>near <span className='italic'>242 D, A. Bonifacio Street</span></p>
          </div>

          <div className='flex flex-col items-center w-[700px] rounded-[15px] bg-[#008c7f] pt-3 pb-5'>

            {/* Type of issue selection */}
            <label htmlFor='issues' className='text-[1.25rem] text-[#e0e0e0] mb-2'>Type of issue</label>
            <div className='relative mb-5'>

              <select name='issues' id='issues' defaultValue='' className='w-[350px] h-[40px] rounded-[15px] text-[0.8rem] bg-[#e0e0e0] pl-5 pr-10 appearance-none cursor-pointer shadow-[_0_2px_2px_rgba(0,0,0,0.5)]'>
                  <option value='' disabled>Select type of issue</option>
                  <option value='issue-1'>Issue 1</option>
                  <option value='issue-2'>Issue 2</option>
                  <option value='issue-3'>Issue 3</option>
                  <option value='issue-4'>Issue 4</option>
              </select>

              {/* Custom arrow */}
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                  <img src='/arrow-down.png' alt='Arrow Down Icon' className='w-[20px] h-[20px]' />
              </div>

            </div>

            <p className='text-[#e0e0e0] text-[0.75rem] mb-3'>Image uploaded: <span className='italic'>report.jpg</span></p>

            {/* Upload/Discard image buttons */}
            <div className='flex gap-3'>
            
              <button className='flex items-center justify-center w-[150px] h-[40px] rounded-[15px] text-[0.8rem] bg-[#e0e0e0] cursor-pointer mb-2 shadow-[_0_2px_2px_rgba(0,0,0,0.5)]'>
                <img src='/upload-photo-icon.png' alt='Upload Photo Icon' className='w-[26px] h-[26px] mr-2' />
                Upload image
              </button>

              <button className='flex items-center justify-center w-[150px] h-[40px] rounded-[15px] text-[0.8rem] text-[#e0e0e0] bg-[#ff2c2c] cursor-pointer mb-3 shadow-[_0_2px_2px_rgba(0,0,0,0.5)]'>
                <img src='/discard-icon.png' alt='Upload Photo Icon' className='w-[22px] h-[22px] mr-2 filter invert brightness-[200%]' />
                Discard image
              </button>

            </div>

            {/* Description container */}
            <label for='description' className='text-[1.25rem] text-[#e0e0e0] mb-2'>Description</label>
            <textarea type='text' placeholder='Write a short description about the issue' className='flex w-[600px] h-[100px] align-text-top resize-none bg-[#00786d] text-[#e0e0e0] rounded-[15px] mb-5 pl-5 pt-5' />

            {/* Make report button */}
            <button className='flex items-center justify-center w-[600px] h-[50px] rounded-[15px] text-[1.25rem] bg-[#00786d] text-[#e0e0e0] cursor-pointer'>
              <img src='/upload-icon.png' alt='Upload Icon' className='w-[26px] h-[26px] mr-3 filter invert brightness-[200%]' />
              Submit report!
            </button>

          </div>

        </div>

      </div>

      {/* ================================================== Settings Page Content ================================================== */}

      {/* Settings Page Content */}
      <div
        className={`flex-1 flex min-h-screen items-center justify-center ${
          activeDiv === 'div4' ? 'bg-[#009688]' : 'hidden'
        }`}
      >

        <div className='flex flex-col w-full h-full items-center justify-center p-5 gap-5'>
          
          <h1 className='text-white text-[2rem] font-bold'>Settings</h1>

          {/* Dark mode */}
          <div className='flex w-[50%] h-[75px] items-center justify-between bg-[#008c7f] rounded-[15px] text-[1.25rem] text-[#e0e0e0] p-5 shadow-lg'>
            
            {/* Left Section: Icon + Text */}
            <div className='flex items-center gap-5'> 
              {/* Icon */}
              <img src='/dark-mode-icon.png' alt='Dark Mode Icon' className='w-[26px] h-[26px] filter invert brightness-[200%]' />

              {/* Texts */}
              <div className='flex flex-col leading-tight'>
                <h1 className='text-[1.25rem] font-bold'>Dark Mode</h1>
                <p className='text-[0.8rem]'>Press/Click to enable dark mode</p>
              </div>
            </div>

            {/* Right Section: Toggle Button */}
            <div className='flex items-center justify-center w-[125px] h-[40px] rounded-[15px] text-[0.8rem] appearance-none cursor-pointer'>
              <div id='toggleButton' className='w-12 h-6 flex items-center bg-gray-300 rounded-full cursor-pointer'>
                <div className='toggle-circle w-5 h-5 bg-white rounded-full transform duration-300 ease-in-out'></div>
              </div>
            </div>

          </div>

          {/* Select language */}
          <div className='flex w-[50%] h-[75px] items-center justify-between bg-[#008c7f] rounded-[15px] text-[1.25rem] text-[#e0e0e0] p-5 shadow-lg'>

            {/* Left Section: Icon + Text */}
            <div className='flex items-center gap-5'>
              {/* Icon */}
              <img src='/language-icon.png' alt='Language Icon' className='w-[26px] h-[26px] filter invert brightness-[200%]' />

              {/* Texts */}
              <div className='flex flex-col leading-tight'>
                <h1 className='text-[1.25rem] font-bold'>Change Language</h1>
                <p className='text-[0.8rem]'>Select your preferred language</p>
              </div>
            </div>

            {/* Right Section: Select Language */}
            <select name='lang' id='lang' className='w-[125px] h-[40px] rounded-[15px] text-[0.8rem] appearance-none cursor-pointer text-[#008c7f] text-center bg-white focus:outline-none'>
              <option value='english'>English</option>
              <option value='filipino'>Filipino</option>
            </select>
            
          </div>

          {/* Report a bug */}
          <div className='flex w-[50%] h-[75px] items-center justify-between bg-[#008c7f] rounded-[15px] text-[1.25rem] text-[#e0e0e0] p-5 shadow-lg'>

            {/* Left Section: Icon + Text */}
            <div className='flex items-center gap-5'>
              {/* Icon */}
              <img src='/bug-icon.png' alt='Bug Icon' className='w-[26px] h-[26px] filter invert brightness-[200%]' />

              {/* Texts */}
              <div className='flex flex-col leading-tight'>
                <h1 className='text-[1.25rem] font-bold'>Report Bug</h1>
                <p className='text-[0.8rem]'>Help us improve Ulat PH by reporting issues</p>
              </div>
            </div>

            {/* Right Section: Report a Bug Button */}
            <button className='flex items-center justify-center w-[125px] h-[40px] font-bold bg-[#ff2c2c] rounded-[15px] text-[0.8rem] appearance-none cursor-pointer shadow-[_0_2px_2px_rgba(0,0,0,0.5)] gap-1 '>
              <p>Report a Bug</p>
            </button>
            
          </div>

          {/* Developer */}
          <div className='flex w-[50%] h-[75px] items-center justify-between bg-[#008c7f] rounded-[15px] text-[1.25rem] text-[#e0e0e0] p-5 shadow-lg'>

            {/* Left Section: Icon + Text */}
            <div className='flex items-center gap-5'>
              {/* Icon */}
              <img
                src='/user-icon.png'
                alt='User Icon'
                className='w-[26px] h-[26px] filter invert brightness-[200%]'
              />

              {/* Texts */}
              <div className='flex flex-col leading-tight'>
                <h1 className='text-[1.25rem] font-bold'>Developer</h1>
                <p className='text-[0.8rem]'>Miguel Ivan Calarde</p>
              </div>
            </div>

            {/* Right Section: Social Links */}
            <div className='flex items-center gap-5 filter invert brightness-[200%]'>
              {/* GitHub Link */}
              <a href='https://github.com/vnclrd' target='_blank' rel='noopener noreferrer' className='flex items-center justify-center'>
                <img src='/github-logo.png' alt='GitHub Logo' className='w-[40px] h-[40px]' />
              </a>

              {/* LinkedIn Link */}
              <a href='https://www.linkedin.com/in/vnclrd/' target='_blank' rel='noopener noreferrer' className='flex items-center justify-center'>
                <img src='/linkedin-logo.png' alt='LinkedIn Logo' className='w-[40px] h-[40px]' />
              </a>

              {/* Portfolio Website Link */}
              <a href='https://vnclrd.github.io/miguel-portfolio/' target='_blank' rel='noopener noreferrer' className='flex items-center justify-center'>
                <img src='/portfolio-website-icon.png' alt='Portfolio Icon' className='w-[40px] h-[40px]' />
              </a>

            </div>

          </div>

          {/* About */}
          <div className='flex w-[50%] h-[75px] items-center justify-between bg-[#008c7f] rounded-[15px] text-[1.25rem] text-[#e0e0e0] p-5 shadow-lg'>

            {/* Left Section: Icon + Text */}
            <div className='flex items-center gap-5'>
              {/* Icon */}
              <img
                src='/about-icon.png'
                alt='User Icon'
                className='w-[26px] h-[26px] filter invert brightness-[200%]'
              />

              {/* Texts */}
              <h1 className='flex flex-col leading-tight text-[1.25rem] font-bold'>About</h1>
            </div>

            {/* Right Section: Social Links */}
            <div className='flex w-[400px] h-[40px] text-[0.75rem] items-center text-right'>
              <p>
                Ulat PH is a community-driven reporting web app that enables civilians
                to crowdsource and track local community issues.
              </p>
            </div>

          </div>

        </div>
        
      </div>

      {/* ================================================== Footer ================================================== */}

      <footer className='fixed flex justify-around items-center w-full h-[75px] bottom-0 bg-[#008377] p-5'>
        
        {/* ========================= Reports Button ========================= */}
        <button
          className={`${baseButtonClassesFooter} ${
            activeDiv === 'div1' 
              ? 'bg-[#006057] text-white rounded-[15px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]' 
              : 'bg-transparent text-[#e0e0e0]'
          }`}
          onClick={() => setActiveDiv('div1')}
        >

          <img src='/reports-icon.png' alt='Reports Icon' className='w-[25px] h-[25px] filter invert' />
          <p className='font-light text-sm mt-[1px]'>Reports</p>

        </button>

        {/* ========================= Location Button ========================= */}
        <button
          className={`${baseButtonClassesFooter} ${
            activeDiv === 'div2' 
              ? 'bg-[#006057] text-white rounded-[15px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]' 
              : 'bg-transparent text-[#e0e0e0]'
          }`}
          onClick={() => setActiveDiv('div2')}
        >

          <img src='/location-icon.png' alt='Location Icon' className='w-[25px] h-[25px] filter invert' />
          <p className='font-light text-sm mt-[1px]'>Location</p>

        </button>

        {/* ========================= Make Report Button ========================= */}
        <button
          className={`${baseButtonClassesFooter} ${
            activeDiv === 'div3' 
              ? 'bg-[#006057] text-white rounded-[15px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]' 
              : 'bg-transparent text-[#e0e0e0]'
          }`}
          onClick={() => setActiveDiv('div3')}
        >

          <img src='/make-report-icon.png' alt='Make Report Icon' className='w-[25px] h-[25px] filter invert' />
          <p className='font-light text-sm mt-[1px]'>Make Report</p>

        </button>

        {/* ========================= Settings Button ========================= */}
        <button
          className={`${baseButtonClassesFooter} ${
            activeDiv === 'div4' 
              ? 'bg-[#006057] text-white rounded-[15px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]' 
              : 'bg-transparent text-[#e0e0e0]'
          }`}
          onClick={() => setActiveDiv('div4')}
        >

          <img src='/settings-icon.png' alt='Settings Icon' className='w-[25px] h-[25px] filter invert' />
          <p className='font-light text-sm mt-[1px]'>Settings</p>
          
        </button>

      </footer>

    </div>
  )
}

export default Core
