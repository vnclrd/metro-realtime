import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import LocationContent from './LocationContent.jsx'

function Core() {
  // Use state to track which div is currently active
  const [activeDiv, setActiveDiv] = useState('div1')
  const baseButtonClassesFooter = 'flex flex-col items-center justify-center w-[25%] h-[60px] cursor-pointer'
  
  const [savedLocationData, setSavedLocationData] = useState(() => {
    const stored = localStorage.getItem("savedLocation");
    return stored ? JSON.parse(stored) : {};
  });

  // Detect user's current location automatically
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setSavedLocationData({
          name: "Your Current Location",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
    }
  }, []);

  const DefaultIcon = L.icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  return (
    <div className='flex flex-col w-full min-h-screen bg-[#009688]'>

      {/* ================================================== Header Content ================================================== */}

      {/* Header */}
      <header className='fixed flex w-full h-[75px] top-0 bg-[#008377] z-1000'>
        <img src='/ulat-ph-logo.png' alt='Ulat PH Logo' className='m-2.5 ml-5' />
        <div className='flex lg:flex-col items-center justify-center'>
          <h1 className='text-[1.5rem] text-[#e0e0e0] font-bold'>Ulat PH</h1>
          <p className='hidden lg:block text-[0.9rem] text-[#e0e0e0] font-light mt-[-5px]'>iulat mo na!</p>
        </div>
        
      </header>

      {/* ================================================== Reports Page Content ================================================== */}
      <div
        className={`flex flex-col min-h-screen items-center justify-center pt-[75px] pb-[75px] ${
          activeDiv === 'div1' ? 'bg-[#008c7f] sm:bg-[#009688]' : 'hidden'
        }`}
      >
        {/* Panels */}
        <div
          className='
            flex flex-col md:flex-row items-center md:items-start justify-between
            w-full max-w-[1200px] mx-auto gap-5 p-5
            rounded-[15px] bg-[#008c7f] lg:shadow-lg
          '
        >
          {/* Left Panel */}
          <div className='flex flex-col w-full md:w-[50%] h-auto md:h-[500px]'>
            <div className='flex flex-col items-center text-center md:text-left'>
              <h1 className='text-[2rem] md:text-[2.5rem] text-[#e0e0e0] font-bold'>
                Reports
              </h1>
              <p className='text-[0.9rem] text-[#e0e0e0] mb-5'>
                near <span className='italic'>**location**</span>
              </p>
            </div>

            {/* Reports Container */}
            <div className='flex items-center justify-center'>
              <div
                className='
                  flex flex-col w-full h-[400px] md:h-[400px] pr-3 gap-4 overflow-y-scroll rounded-lg
                  scrollbar scrollbar-thin scrollbar-thumb-[#008c7f] scrollbar-track-[#e0e0e0]
                '
              >
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className='w-full h-[70px] md:h-[75px] rounded-[25px] bg-[#00786d] flex-shrink-0 '
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className='flex items-center justify-center w-full md:w-[50%] h-auto md:h-[500px]'>
            <div className='flex flex-col w-full h-full bg-[#008c7f] rounded-[15px] gap-5'>
              {/* Image Holder */}
              <div className='w-full h-[200px] md:h-[50%] rounded-[15px] bg-[#009688] text-[#e0e0e0]'>
                <img
                  src='/'
                  alt='Photo of report'
                  className='w-full h-full object-cover rounded-[15px]'
                />
              </div>

              {/* Description */}
              <div className='w-full md:h-[50%] bg-[#00786d] rounded-[15px] text-[#e0e0e0] overflow-y-scroll p-4'>
                <p>

                </p>
              </div>

              {/* Button */}
              <button className='flex items-center justify-center w-full h-[50px] bg-[#00786d] text-[#e0e0e0] rounded-[15px] cursor-pointer'>
                <img
                  src='/vision-icon.png'
                  alt='Vision Icon'
                  className='w-[30px] md:w-[40px] h-[30px] md:h-[40px] filter invert m-2 md:m-3'
                />
                I see this too
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== Location Page Content ================================================== */}

      <div
        className={`flex flex-col min-h-screen items-center justify-center ${
          activeDiv === "div2" ? "bg-[#008c7f] sm:bg-[#009688]" : "hidden"
        }`}
      >
        <div
          className="
            flex flex-col items-center justify-center
            w-full sm:w-[90%] md:w-[80%] lg:w-[1000px]
            h-[400px] sm:h-[300px] md:h-[500px]
            bg-[#008C7F] rounded-[25px] text-[#e0e0e0]
            lg:shadow-lg p-5
          "
        >
          {/* Location Component */}
          <LocationContent
            location={savedLocationData}
            setlocation={setSavedLocationData}
          />
        </div>
      </div>
        
      {/* ================================================== Make Report Page Content ================================================== */}

      <div
        className={`flex-1 flex min-h-screen items-center justify-center ${
          activeDiv === "div3" ? "bg-[#008c7f] lg:bg-[#009688]" : "hidden"
        }`}
      >
        <div className="flex flex-col w-full h-full items-center justify-center lg:px-5">
          {/* Form Container */}
          <div className="flex flex-col items-center w-full sm:w-[90%] md:w-[700px] rounded-[15px] bg-[#008c7f] pt-5 pb-6 px-5 lg:shadow-lg">
            {/* Page Header */}
            <div className="flex flex-col items-center justify-center w-full mb-5 text-center">
              <h1 className="text-[1.75rem] md:text-[2.5rem] text-[#e0e0e0] font-bold">
                Report an Issue
              </h1>
              <p className="text-[0.85rem] md:text-[0.9rem] text-[#e0e0e0]">
                near <span className="italic">242 D, A. Bonifacio Street</span>
              </p>
            </div>

            {/* Uploaded photo preview */}
            <div className="flex items-center justify-center w-full sm:w-[80%] md:w-[400px] h-[180px] sm:h-[200px] rounded-xl text-[#e0e0e0] bg-[#009688] mb-3 text-center px-2">
              Uploaded image preview goes here
            </div>

            {/* Uploaded Image Info */}
            <p className="text-[#e0e0e0] text-xs md:text-sm mb-3 text-center md:text-left">
              Image uploaded: <span className="italic">report.jpg</span>
            </p>

            {/* Upload / Discard Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center sm:justify-start mb-4">
              <button className="flex items-center justify-center w-full sm:w-[150px] h-[40px] rounded-[15px] text-sm bg-[#e0e0e0] cursor-pointer shadow-[_0_2px_2px_rgba(0,0,0,0.5)]">
                <img
                  src="/upload-photo-icon.png"
                  alt="Upload Photo Icon"
                  className="w-[24px] h-[24px] mr-2"
                />
                Upload image
              </button>

              <button className="flex items-center justify-center w-full sm:w-[150px] h-[40px] rounded-[15px] text-sm text-[#e0e0e0] bg-[#ff2c2c] cursor-pointer shadow-[_0_2px_2px_rgba(0,0,0,0.5)]">
                <img
                  src="/discard-icon.png"
                  alt="Discard Icon"
                  className="w-[20px] h-[20px] mr-2 filter invert brightness-[200%]"
                />
                Discard image
              </button>
            </div>

            {/* Type of issue selection */}
            <div className="relative mb-5 w-full sm:w-[350px]">
              <select
                name="issues"
                id="issues"
                defaultValue=""
                className="w-full h-[40px] rounded-[15px] text-sm md:text-base bg-[#e0e0e0] pl-5 pr-10 appearance-none"
              >
                <option value="" disabled>
                  Select type of issue
                </option>
                <option value="custom">Custom Issue</option>
                <option value="issue-1">Issue 1</option>
                <option value="issue-2">Issue 2</option>
                <option value="issue-3">Issue 3</option>
                <option value="issue-4">Issue 4</option>
              </select>

              {/* Custom arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <img
                  src="/arrow-down.png"
                  alt="Arrow Down Icon"
                  className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]"
                />
              </div>
            </div>

            <div className="relative w-full sm:w-[350px]">
              <textarea
                name="issues"
                placeholder='Type custom issue here'
                className="hidden text-left items-center w-full h-[40px] p-2 resize-none rounded-[15px] text-sm md:text-base bg-[#e0e0e0] pl-5 pr-10 appearance-none"
              >
              </textarea>
            </div>

            {/* Description Container */}
            <textarea
              name="description"
              placeholder="Write a short description about the issue"
              className="w-full sm:w-[90%] md:w-[600px] h-[100px] resize-none bg-[#00786d] text-[#e0e0e0] rounded-[15px] mb-5 pl-5 pt-4 text-sm md:text-base shadow-inner"
            />

            {/* Submit Button */}
            <button className="flex items-center justify-center w-full sm:w-[90%] md:w-[600px] h-[50px] rounded-[15px] text-base md:text-lg bg-[#00786d] text-[#e0e0e0] cursor-pointer">
              <img
                src="/upload-icon.png"
                alt="Upload Icon"
                className="w-[24px] h-[24px] mr-3 filter invert brightness-[200%]"
              />
              Submit report!
            </button>
          </div>
        </div>
      </div>

      {/* ================================================== Settings Page Content ================================================== */}

      {/* Settings Page Content */}
      <div
        className={`flex-1 flex min-h-screen items-center justify-center pt-[75px] pb-[75px] ${
          activeDiv === 'div4' ? 'bg-[#009688]' : 'hidden'
        }`}
      >
        <div className="flex flex-col w-full h-full lg:h-90 items-center justify-center p-5 gap-5">
          
          {/* Title */}
          <h1 className="text-white text-2xl md:text-[2.5rem] font-bold">Settings</h1>

          {/* Dark Mode */}
          <div className="flex w-full sm:w-[90%] md:w-[70%] lg:w-[50%] h-auto min-h-[75px] flex-col sm:flex-row lg:items-center justify-between bg-[#008c7f] rounded-2xl text-base md:text-lg text-[#e0e0e0] p-5 gap-3 shadow-lg">
            
            {/* Left Section: Icon + Text */}
            <div className="flex items-center gap-4 sm:gap-5">
              <img
                src="/dark-mode-icon.png"
                alt="Dark Mode Icon"
                className="w-6 h-6 md:w-7 md:h-7 filter invert brightness-[200%]"
              />
              <div className="flex flex-col leading-tight">
                <h1 className="text-base md:text-lg font-bold">Dark Mode</h1>
                <p className="text-xs md:text-sm">Press/Click to enable dark mode</p>
              </div>
            </div>

            {/* Right Section: Toggle Button */}
            <div className="flex items-center lg:justify-center w-[100px] md:w-[125px] h-[40px] rounded-xl text-xs md:text-sm cursor-pointer">
              <div id="toggleButton" className="w-12 h-6 flex items-center bg-gray-300 rounded-full cursor-pointer">
                <div className="toggle-circle w-5 h-5 bg-white rounded-full transform duration-300 ease-in-out"></div>
              </div>
            </div>
          </div>

          {/* Select Language */}
          <div className="flex w-full sm:w-[90%] md:w-[70%] lg:w-[50%] h-auto min-h-[75px] flex-col sm:flex-row lg:items-center justify-between bg-[#008c7f] rounded-2xl text-base md:text-lg text-[#e0e0e0] p-5 gap-3 shadow-lg">
            
            {/* Left Section */}
            <div className="flex items-center gap-4 sm:gap-5">
              <img
                src="/language-icon.png"
                alt="Language Icon"
                className="w-6 h-6 md:w-7 md:h-7 filter invert brightness-[200%]"
              />
              <div className="flex flex-col leading-tight">
                <h1 className="text-base md:text-lg font-bold">Change Language</h1>
                <p className="text-xs md:text-sm">Select your preferred language</p>
              </div>
            </div>

            {/* Right Section: Select Box */}
            <select
              name="lang"
              id="lang"
              className="w-[100px] md:w-[125px] h-[40px] rounded-xl text-xs md:text-sm appearance-none cursor-pointer text-[#008c7f] text-center bg-white focus:outline-none"
            >
              <option value="english">English</option>
              <option value="filipino">Filipino</option>
            </select>
          </div>

          {/* Report Bug */}
          <div className="flex w-full sm:w-[90%] md:w-[70%] lg:w-[50%] h-auto min-h-[75px] flex-col sm:flex-row lg:items-center justify-between bg-[#008c7f] rounded-2xl text-base md:text-lg text-[#e0e0e0] p-5 gap-3 shadow-lg">
            
            {/* Left Section */}
            <div className="flex items-center gap-4 sm:gap-5">
              <img
                src="/bug-icon.png"
                alt="Bug Icon"
                className="w-6 h-6 md:w-7 md:h-7 filter invert brightness-[200%]"
              />
              <div className="flex flex-col leading-tight">
                <h1 className="text-base md:text-lg font-bold">Report Bug</h1>
                <p className="text-xs md:text-sm">Help us improve Ulat PH by reporting issues</p>
              </div>
            </div>

            {/* Right Section: Button */}
            <button className="flex items-center justify-center w-[100px] md:w-[125px] h-[40px] font-bold bg-[#ff2c2c] rounded-xl text-xs md:text-sm cursor-pointer shadow-[0_2px_2px_rgba(0,0,0,0.5)] gap-1">
              Report a Bug
            </button>
          </div>

          {/* Developer */}
          <div className="flex w-full sm:w-[90%] md:w-[70%] lg:w-[50%] h-auto min-h-[75px] flex-col sm:flex-row lg:items-center justify-between bg-[#008c7f] rounded-2xl text-base md:text-lg text-[#e0e0e0] p-5 gap-3 shadow-lg">
            
            {/* Left Section */}
            <div className="flex items-center gap-4 sm:gap-5">
              <img
                src="/user-icon.png"
                alt="User Icon"
                className="w-6 h-6 md:w-7 md:h-7 filter invert brightness-[200%]"
              />
              <div className="flex flex-col leading-tight">
                <h1 className="text-base md:text-lg font-bold">Developer</h1>
                <p className="text-xs md:text-sm">Miguel Ivan Calarde</p>
              </div>
            </div>

            {/* Right Section: Social Links */}
            <div className="flex items-center gap-4 sm:gap-5 filter invert brightness-[200%]">
              <a href="https://github.com/vnclrd" target="_blank" rel="noopener noreferrer">
                <img src="/github-logo.png" alt="GitHub" className="w-7 h-7 md:w-10 md:h-10" />
              </a>
              <a href="https://www.linkedin.com/in/vnclrd/" target="_blank" rel="noopener noreferrer">
                <img src="/linkedin-logo.png" alt="LinkedIn" className="w-7 h-7 md:w-10 md:h-10" />
              </a>
              <a href="https://vnclrd.github.io/miguel-portfolio/" target="_blank" rel="noopener noreferrer">
                <img src="/portfolio-website-icon.png" alt="Portfolio" className="w-7 h-7 md:w-10 md:h-10" />
              </a>
            </div>
          </div>
          
          {/* About */}
          <div className="flex w-full sm:w-[90%] md:w-[70%] lg:w-[50%] h-auto min-h-[75px] flex-col sm:flex-row lg:items-center justify-between bg-[#008c7f] rounded-2xl text-base md:text-lg text-[#e0e0e0] p-5 gap-3 shadow-lg">
            
            {/* Left Section */}
            <div className="flex items-center gap-4 sm:gap-5">
              <img
                src="/about-icon.png"
                alt="About Icon"
                className="w-6 h-6 md:w-7 md:h-7 filter invert brightness-[200%]"
              />
              <h1 className="text-base md:text-lg font-bold">About</h1>
            </div>

            {/* Right Section */}
            <div className="flex text-left w-full sm:w-[300px] md:w-[500px] h-auto text-xs md:text-sm lg:text-right">
              <p>
                Ulat PH is a community-driven reporting web app that enables civilians
                to crowdsource and track local community issues.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== Footer ================================================== */}

      <footer className='fixed flex justify-around items-center w-full h-[75px] bottom-0 bg-[#008377] p-5 z-1000'>
        
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
