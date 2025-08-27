import React, { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import LocationContent from './LocationContent.jsx'

function Core() {
  // FILE SAVING COMPONENTS
  const [customIssue, setCustomIssue] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // View reports on Reports Page
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  // Button click tracking states
  const [buttonLoading, setButtonLoading] = useState({});
  const [buttonStatus, setButtonStatus] = useState(null);

  const [activeDiv, setActiveDiv] = useState('div1');
  const baseButtonClassesFooter = 'flex flex-col items-center justify-center w-[25%] h-[60px] cursor-pointer';

  const [selectedIssue, setSelectedIssue] = useState('');
  const [locationName, setLocationName] = useState('Fetching location...');

  // For already clicked verification
  const [userClickedButtons, setUserClickedButtons] = useState({});

  const [savedLocationData, setSavedLocationData] = useState(() => {
    const stored = localStorage.getItem('savedLocation');
    return stored ? JSON.parse(stored) : {};
  });

  // For already clicked verification
  const checkUserButtonStatus = async (reportId) => {
    if (!reportId) return;
    
    try {
      const response = await fetch(`http://192.168.1.3:5000/api/reports/${reportId}/user-status`);
      const result = await response.json();
      
      if (result.success) {
        setUserClickedButtons(prev => ({
          ...prev,
          [`${reportId}_sightings`]: result.has_sighting_click,
          [`${reportId}_resolved`]: result.has_resolved_click
        }));
      }
    } catch (error) {
      console.error('Error checking user button status:', error);
    }
  };

  // Function to calculate distance between two coordinates using Haversine formula
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Function to filter reports based on location
  const filterReportsByLocation = (allReports, location) => {
    if (!location || !location.lat || !location.lng) {
      setReports([]);
      setSelectedReport(null);
      return;
    }

    const filtered = allReports.filter(report => {
      const distance = getDistance(
        location.lat,
        location.lng,
        report.latitude,
        report.longitude
      );
      return distance <= 1; // Filter for reports within 1 km
    });
    
    setReports(filtered);
    if (filtered.length > 0) {
      setSelectedReport(filtered[0]);
    } else {
      setSelectedReport(null);
    }
  };

  // Function to refresh reports data
  const fetchReports = async () => {
    try {
      const response = await fetch('http://192.168.1.3:5000/api/reports');
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data = await response.json();
      setAllReports(data.reports);
      filterReportsByLocation(data.reports, savedLocationData);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  // Function to handle sightings button click
  const handleSightingsClick = async (reportId) => {
    if (!reportId || buttonLoading[`sightings-${reportId}`] || userClickedButtons[`${reportId}_sightings`]) return;

    setButtonLoading(prev => ({ ...prev, [`sightings-${reportId}`]: true }));
    setButtonStatus(null);

    try {
      const response = await fetch(`http://192.168.1.3:5000/api/reports/${reportId}/sightings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (result.success) {
        setButtonStatus({
          type: 'success',
          message: result.message
        });
        
        // Mark button as clicked
        setUserClickedButtons(prev => ({
          ...prev,
          [`${reportId}_sightings`]: true
        }));
        
        // Refresh reports data to get updated counts
        await fetchReports();
      } else {
        setButtonStatus({
          type: 'error',
          message: result.message
        });
      }
    } catch (error) {
      setButtonStatus({
        type: 'error',
        message: 'Failed to record sighting'
      });
    } finally {
      setButtonLoading(prev => ({ ...prev, [`sightings-${reportId}`]: false }));
      // Clear status message after 3 seconds
      setTimeout(() => setButtonStatus(null), 3000);
    }
  };

  // Function to handle resolved button click
  const handleResolvedClick = async (reportId) => {
    if (!reportId || buttonLoading[`resolved-${reportId}`] || userClickedButtons[`${reportId}_resolved`]) return;

    setButtonLoading(prev => ({ ...prev, [`resolved-${reportId}`]: true }));
    setButtonStatus(null);

    try {
      const response = await fetch(`http://192.168.1.3:5000/api/reports/${reportId}/resolved`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (result.success) {
        setButtonStatus({
          type: 'success',
          message: result.message
        });

        // Mark button as clicked
        setUserClickedButtons(prev => ({
          ...prev,
          [`${reportId}_resolved`]: true
        }));
        
        // If report was deleted, clear selection
        if (result.report_deleted) {
          setSelectedReport(null);
        }
        
        // Refresh reports data to get updated counts
        await fetchReports();
      } else {
        setButtonStatus({
          type: 'error',
          message: result.message
        });
      }
    } catch (error) {
      setButtonStatus({
        type: 'error',
        message: 'Failed to record resolution'
      });
    } finally {
      setButtonLoading(prev => ({ ...prev, [`resolved-${reportId}`]: false }));
      // Clear status message after 3 seconds
      setTimeout(() => setButtonStatus(null), 3000);
    }
  };

  // Update your selectedReport useEffect or add this
  useEffect(() => {
    if (selectedReport?.id) {
      checkUserButtonStatus(selectedReport.id);
    }
  }, [selectedReport?.id]);

  // Fetch reports from backend (reports.json) and filter them based on location
  useEffect(() => {
    fetchReports();
  }, [savedLocationData]);

  // Load saved location on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedLocation');
    if(saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedLocationData(parsed);
        setLocationName(parsed.name || 'Unknown location');
      } catch (err) {
        console.error('Failed to parse saved location:', err);
      }
    }
  }, []);

  // Detect user's current location automatically if no saved location
  useEffect(() => {
    if (!savedLocationData.lat && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const newLocation = {
          name: 'Your Current Location',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setSavedLocationData(newLocation);
        setLocationName(newLocation.name);
      });
    }
  }, [savedLocationData.lat]);

  // Update locationName when savedLocationData changes
  useEffect(() => {
    if (savedLocationData.name) {
      setLocationName(savedLocationData.name);
    }
  }, [savedLocationData]);

  // Handler functions for image saving
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler function for uploaded image discarding
  const handleDiscardImage = () => {
    setUploadedImage(null);
    setImagePreview('');
    // Reset file input
    const fileInput = document.querySelector("input[type='file']");
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Validation
      if (!selectedIssue) {
        throw new Error('Please select an issue type');
      }
      
      if (selectedIssue === 'custom' && !customIssue.trim()) {
        throw new Error('Please describe the custom issue');
      }
      
      if (!description.trim()) {
        throw new Error('Please provide a description');
      }

      // Prepare form data
      const formData = new FormData();
      
      if (uploadedImage) {
        formData.append('image', uploadedImage);
      }
      
      formData.append('issueType', selectedIssue);
      formData.append('customIssue', customIssue);
      formData.append('description', description);
      formData.append('location', locationName);
      formData.append('latitude', savedLocationData.lat);
      formData.append('longitude', savedLocationData.lng);

      // Submit to backend
      const response = await fetch('http://192.168.1.3:5000/api/reports', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Report submitted successfully!'
        });
        
        // Reset form
        setSelectedIssue('');
        setCustomIssue('');
        setDescription('');
        handleDiscardImage();

        // Refresh reports data
        await fetchReports();
      } else {
        throw new Error(result.message || 'Failed to submit report');
      }

    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIssueChange = (e) => {
    setSelectedIssue(e.target.value);
  };
  
  // Handle location updates from LocationContent
  const handleLocationUpdate = (newLocationData) => {
    setSavedLocationData(newLocationData);
    setLocationName(newLocationData.name);
    // Save to localStorage
    localStorage.setItem('savedLocation', JSON.stringify(newLocationData));
  };

  const DefaultIcon = L.icon({
    iconUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  return (
    <div className='flex flex-col w-full min-h-screen bg-[#009688]'>

      {/* ================================================== Header Content ================================================== */}
      <header className='fixed flex w-full h-[75px] top-0 bg-[#008377] z-1000 dark:bg-[#141b2b]'>
        <img src='/ulat-ph-logo.png' alt='Ulat PH Logo' className='m-2.5 ml-5' />
        <div className='flex lg:flex-col items-center justify-center'>
          <h1 className='text-[1.5rem] text-[#e0e0e0] font-bold'>Ulat PH</h1>
          <p className='hidden lg:block text-[0.9rem] text-[#e0e0e0] font-light mt-[-5px]'>iulat mo na!</p>
        </div>
        
      </header>

      {/* ================================================== Reports Page Content ================================================== */}
      <div
        className={`flex flex-col min-h-screen items-center justify-center pt-[65px] pb-[75px] ${
          activeDiv === 'div1' ? 'bg-[#008c7f] sm:bg-[#009688] dark dark:bg-[#1b253a]' : 'hidden'
        }`}
      >
        {/* Panels */}
        <div
          className='
            flex flex-col md:flex-row items-center md:items-start justify-between
            w-full max-w-[1200px] mx-auto gap-5 p-5
            rounded-[15px] bg-[#008c7f] lg:shadow-lg dark md:dark:bg-[#141b2b] dark:bg-[#1b253a]
          '
        >
          {/* Left Panel */}
          <div className='flex flex-col w-full md:w-[50%] h-auto md:h-[500px]'>
            <div className='flex flex-col items-center text-center md:text-left'>
              <h1 className='text-[2rem] md:text-[2.5rem] text-[#e0e0e0] font-bold'>
                Reports
              </h1>
              <p className='text-sm text-[#e0e0e0] mb-5 text-center'>
                near your location:
                <br />
                <span className='italic text-[#e0e0e0]'>{locationName}</span>
              </p>
            </div>

            {/* Reports Container */}
            <div className='flex items-center justify-center'>
              <div
                className='
                  flex flex-col w-full h-[400px] md:h-[350px] pr-3 gap-4 overflow-y-scroll rounded-lg
                  scrollbar scrollbar-thin scrollbar-thumb-[#008c7f] scrollbar-track-[#e0e0e0] 
                '
              >
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <div
                      key={report.id}
                      className={`w-full h-[70px] md:h-[75px] rounded-[25px] bg-[#00786d] flex-shrink-0 cursor-pointer p-4 transition-all duration-200 ease-in-out dark dark:bg-[#11161f] ${
                        selectedReport?.id === report.id ? 'border-2 border-white' : ''
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className='flex justify-between items-center w-full'>
                        <div className='flex flex-col'>
                          <h3 className='text-[#e0e0e0] font-bold text-base md:text-lg'>
                            {report.issue_type === 'custom' ? report.custom_issue : report.issue_type}
                          </h3>
                          <p className='text-sm text-[#a0a0a0] truncate mt-[-4px]'>
                            {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}
                          </p>
                        </div>
                        <div className='flex items-center gap-2'>
                          {/* Sightings */}
                          <img src='/vision-icon.png' alt='Sightings Icon' className='w-[26px] h-[26px] filter invert' />
                          <span className='text-[#e0e0e0] text-[1.25rem] mr-2'>
                            {report.sightings?.count || 0}
                          </span>

                          {/* Resolved Votes */}
                          <img src='/resolved-icon.png' alt='Resolved Icon' className='w-[26px] h-[26px]' />
                          <span className='text-[#e0e0e0] text-[1.25rem]'>
                            {report.resolved?.count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-[#e0e0e0] text-center italic mt-10'>No reports found.</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className='flex items-center justify-center w-full md:w-[50%] h-auto md:h-[500px]'>
            <div className='flex flex-col w-full h-full rounded-[15px] gap-5'>
              {/* Status Message for Button Actions */}
              {buttonStatus && (
                <div className={`p-3 rounded-lg text-center text-sm ${
                  buttonStatus.type === 'success' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-red-600 text-white'
                }`}>
                  {buttonStatus.message}
                </div>
              )}

              {/* Image Holder */}
              <div className='w-full h-[200px] md:h-[50%] rounded-[15px] text-[#e0e0e0] flex items-center justify-center'>
                {selectedReport && selectedReport.image_filename ? (
                  <img
                    src={`http://192.168.1.3:5000/api/images/${selectedReport.image_filename}`}
                    alt='Photo of report'
                    className='w-full h-full object-cover rounded-[15px]'
                  />
                ) : (
                  <span className='italic'>No image available</span>
                )}
              </div>

              {/* Description */}
              <div className='flex items-center justify-center w-full h-auto gap-2 text-[#e0e0e0] text-sm md:text-[1rem]'>
                <img src='/vision-icon.png' alt='Sightings Icon' className='w-[26px] h-[26px] filter invert' />
                <p className='mr-2'>{selectedReport?.sightings?.count || 0} people saw this issue</p>
                <img src='/resolved-icon.png' alt='Resolved Icon' className='w-[26px] h-[26px]' />
                <p>{selectedReport?.resolved?.count || 0} people said it has been resolved</p>
              </div>
              
              <div className='w-full md:h-[25%] bg-[#00786d] rounded-[15px] text-[#e0e0e0] overflow-y-scroll p-4 dark dark:bg-[#11161f]'>
                <p>
                  {selectedReport?.description || 'Select a report to view its details.'}
                </p>
              </div>

              {/* Buttons */}
              <div className='flex gap-3'>
                {/* Sightings Button */}
                <button 
                  onClick={() => handleSightingsClick(selectedReport?.id)}
                  disabled={!selectedReport || buttonLoading[`sightings-${selectedReport?.id}`] || userClickedButtons[`${selectedReport?.id}_sightings`]}
                  className={`flex items-center justify-center w-[50%] h-[50px] text-[#e0e0e0] text-[0.8rem] md:text-[1rem] rounded-[15px] transition-colors ${
                    userClickedButtons[`${selectedReport?.id}_sightings`]
                      ? 'bg-gray-500 cursor-not-allowed opacity-60'
                      : 'bg-[#00786d] cursor-pointer hover:bg-[#006b61] dark:hover:bg-[#222938] disabled:opacity-50 disabled:cursor-not-allowed dark dark:bg-[#11161f]'
                  }`}
                >
                  <img
                    src='/vision-icon.png'
                    alt='Vision Icon'
                    className={`w-[30px] md:w-[40px] h-[30px] md:h-[40px] filter mr-2 ${
                      userClickedButtons[`${selectedReport?.id}_sightings`] ? 'invert opacity-60' : 'invert'
                    }`}
                  />
                  {userClickedButtons[`${selectedReport?.id}_sightings`] 
                    ? "You've seen this" 
                    : buttonLoading[`sightings-${selectedReport?.id}`] 
                      ? 'Loading...' 
                      : 'I see this too'
                  }
                </button>

                {/* Resolved Button */}
                <button 
                  onClick={() => handleResolvedClick(selectedReport?.id)}
                  disabled={!selectedReport || buttonLoading[`resolved-${selectedReport?.id}`] || userClickedButtons[`${selectedReport?.id}_resolved`]}
                  className={`flex items-center justify-center w-[50%] h-[50px] text-[#e0e0e0] text-[0.8rem] md:text-[1rem] rounded-[15px] transition-colors ${
                    userClickedButtons[`${selectedReport?.id}_resolved`]
                      ? 'bg-gray-500 cursor-not-allowed opacity-60'
                      : 'bg-[#00786d] dark:bg-[#11161f] cursor-pointer hover:bg-[#006b61] disabled:opacity-50 disabled:cursor-not-allowed dark dark:hover:bg-[#222938]'
                  }`}
                >
                  <img
                    src='/resolved-icon.png'
                    alt='Vision Icon'
                    className={`w-[30px] md:w-[30px] h-[30px] md:h-[30px] mr-1 md:mr-2 ${
                      userClickedButtons[`${selectedReport?.id}_resolved`] ? 'opacity-60' : ''
                    }`}
                  />
                  {userClickedButtons[`${selectedReport?.id}_resolved`] 
                    ? 'Has been resolved' 
                    : buttonLoading[`resolved-${selectedReport?.id}`] 
                      ? 'Loading...' 
                      : 'Has been resolved'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== Location Page Content ================================================== */}
      <div
        className={`flex flex-col sm:items-center sm:justify-center md:items-center md:justify-center lg:items-center lg:justify-center min-h-screen pt-[65px] pb-[75px] ${
          activeDiv === 'div2' ? 'bg-[#008c7f] sm:bg-[#009688]' : 'hidden'
        }`}
      >
        <div
          className='
            flex flex-col items-center justify-center
            w-full sm:w-[90%] md:w-[80%] lg:w-[1000px]
            h-[500px] sm:h-[500px] md:h-[500px]
            bg-[#008C7F] rounded-[25px] text-[#e0e0e0]
            lg:shadow-lg p-5
          '
        >
          {/* Location Component */}
          <LocationContent
            location={savedLocationData}
            setLocation={handleLocationUpdate}
          />
        </div>
      </div>
        
      {/* ================================================== Make Report Page Content ================================================== */}
      <div
        className={`flex flex-col sm:items-center sm:justify-center md:items-center md:justify-center lg:items-center lg:justify-center min-h-screen pt-[65px] pb-[75px] ${
          activeDiv === 'div3' ? 'bg-[#008c7f] lg:bg-[#009688]' : 'hidden'
        }`}
      >
        <div className='flex flex-col w-full h-full items-center justify-center lg:px-5 lg:mt-0'>
          {/* Form Container */}
          <form onSubmit={handleSubmit} className='flex flex-col items-center w-full sm:w-[90%] md:w-[700px] rounded-[15px] bg-[#008c7f] pt-5 pb-6 px-5 lg:shadow-lg'>
            {/* Page Header */}
            <div className='flex flex-col items-center justify-center w-full mb-5 text-center'>
              <h1 className='text-[2rem] md:text-[2.5rem] text-[#e0e0e0] font-bold'>
                Make a Report
              </h1>
              <p className='text-sm md:text-[0.9rem] text-[#e0e0e0]'>near your location:</p>
              <p className='text-sm md:text-[0.9rem] text-[#e0e0e0] italic'>{locationName}</p>
            </div>

            {/* Status Message */}
            {submitStatus && (
              <div className={`w-full sm:w-[90%] md:w-[600px] p-3 rounded-lg mb-4 text-center ${
                submitStatus.type === 'success' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white'
              }`}>
                {submitStatus.message}
              </div>
            )}

            {/* Uploaded photo preview */}
            <div className='flex items-center justify-center w-full sm:w-[80%] md:w-[400px] h-[180px] sm:h-[200px] rounded-xl text-[#e0e0e0] bg-[#009688] mb-3 text-center px-2 overflow-hidden'>
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt='Preview' 
                  className='max-w-full max-h-full object-contain'
                />
              ) : (
                'Uploaded image preview goes here'
              )}
            </div>

            {/* Uploaded Image Info */}
            <p className='text-[#e0e0e0] text-xs md:text-sm mb-3 text-center md:text-left'>
              {uploadedImage ? (
                <>Image uploaded: <span className='italic'>{uploadedImage.name}</span></>
              ) : (
                'No image selected'
              )}
            </p>

            {/* Upload / Discard Buttons */}
            <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center sm:justify-start mb-4'>
              <label className='flex items-center justify-center w-full sm:w-[150px] h-[40px] rounded-[15px] text-sm bg-[#e0e0e0] cursor-pointer shadow-[_0_2px_2px_rgba(0,0,0,0.5)]'>
                <img
                  src='/upload-photo-icon.png'
                  alt='Upload Photo Icon'
                  className='w-[24px] h-[24px] mr-2'
                />
                Upload image
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='hidden'
                />
              </label>

              <button 
                type='button'
                onClick={handleDiscardImage}
                disabled={!uploadedImage}
                className='flex items-center justify-center w-full sm:w-[150px] h-[40px] rounded-[15px] text-sm text-[#e0e0e0] bg-[#ff2c2c] cursor-pointer shadow-[_0_2px_2px_rgba(0,0,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <img
                  src='/discard-icon.png'
                  alt='Discard Icon'
                  className='w-[20px] h-[20px] mr-2 filter invert brightness-[200%]'
                />
                Discard image
              </button>
            </div>

            {/* Type of issue selection */}
            <div className='relative mb-4 w-full sm:w-[350px]'>
              <select
                name='issues'
                id='issues'
                value={selectedIssue}
                onChange={handleIssueChange}
                className='w-full h-[40px] rounded-[15px] text-sm md:text-base bg-[#e0e0e0] pl-5 pr-10 appearance-none'
                required
              >
                <option value='' disabled>
                  Select type of issue
                </option>
                <option value='custom'>Custom Issue</option>
                <option value='pothole'>Pothole</option>
                <option value='broken-streetlight'>Broken Streetlight</option>
                <option value='graffiti'>Graffiti</option>
                <option value='garbage'>Garbage/Litter</option>
                <option value='damaged-sidewalk'>Damaged Sidewalk</option>
              </select>

              {/* Custom arrow */}
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <img
                  src='/arrow-down.png'
                  alt='Arrow Down Icon'
                  className='w-[18px] h-[18px] md:w-[20px] md:h-[20px]'
                />
              </div>
            </div>

            {/* Custom issue text area */}
            {selectedIssue === 'custom' && (
              <div className='relative w-full sm:w-[350px] mb-4'>
                <textarea
                  name='customIssue'
                  placeholder='Describe your issue'
                  value={customIssue}
                  onChange={(e) => setCustomIssue(e.target.value)}
                  className='text-left w-full h-[40px] pl-5 pt-2.5 resize-none rounded-[15px] text-sm md:text-base bg-[#e0e0e0] appearance-none'
                  required={selectedIssue === 'custom'}
                />
              </div>
            )}

            {/* Description Container */}
            <textarea
              name='description'
              placeholder='Write a short description about the issue'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full sm:w-[90%] md:w-[600px] h-[100px] resize-none bg-[#00786d] text-[#e0e0e0] rounded-[15px] mb-5 pl-5 pt-4 text-sm md:text-base shadow-inner placeholder-[#a0a0a0]'
              required
            />

            {/* Submit Button */}
            <button 
              type='submit'
              disabled={isSubmitting}
              className='flex items-center justify-center w-full sm:w-[90%] md:w-[600px] h-[50px] rounded-[15px] text-base md:text-lg bg-[#00786d] text-[#e0e0e0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#006b61] transition-colors'
            >
              <img
                src='/upload-icon.png'
                alt='Upload Icon'
                className='w-[24px] h-[24px] mr-3 filter invert brightness-[200%]'
              />
              {isSubmitting ? 'Submitting...' : 'Submit report!'}
            </button>
          </form>
        </div>
      </div>

      {/* ================================================== Settings Page Content ================================================== */}
      <div
        className={`flex flex-col sm:items-center sm:justify-center md:items-center md:justify-center lg:items-center lg:justify-center min-h-screen pt-[75px] pb-[75px] ${
          activeDiv === 'div4' ? 'bg-[#008c7f] lg:bg-[#009688]' : 'hidden'
        }`}
      >
        <div className='flex flex-col w-full h-full lg:h-90 items-center justify-center pl-5 pr-5 gap-5 p-3'>
          
          {/* Title */}
          <h1 className='text-[#e0e0e0] text-[2rem] md:text-[2.5rem] font-bold mb-[-10px]'>Settings</h1>

          {/* Dark Mode */}
          <div className='flex w-full sm:w-[90%] md:w-[70%] lg:w-[50%] h-auto min-h-[75px] flex-col sm:flex-row lg:items-center justify-between bg-[#008c7f] rounded-2xl text-base md:text-lg text-[#e0e0e0] p-5 gap-3 shadow-lg'>
            
            {/* Left Section: Icon + Text */}
            <div className='flex items-center gap-4 sm:gap-5'>
              <img
                src='/dark-mode-icon.png'
                alt='Dark Mode Icon'
                className='w-6 h-6 md:w-7 md:h-7 filter invert brightness-[200%]'
              />
              <div className='flex flex-col leading-tight'>
                <h1 className='text-base md:text-lg font-bold'>Dark Mode</h1>
                <p className='text-xs md:text-sm'>Press/Click to enable dark mode</p>
              </div>
            </div>

            {/* Right Section: Toggle Button */}
            <div className='flex items-center lg:justify-center w-[100px] md:w-[125px] h-[40px] rounded-xl text-xs md:text-sm cursor-pointer'>
              <div id='toggleButton' className='w-12 h-6 flex items-center bg-gray-300 rounded-full cursor-pointer'>
                <div className='toggle-circle w-5 h-5 bg-white rounded-full transform duration-300 ease-in-out'></div>
              </div>
            </div>
          </div>

          {/* Select Language */}
          <div className='flex w-full sm:w-[90%] md:w-[70%] lg:w-[50%] h-auto min-h-[75px] flex-col sm:flex-row lg:items-center justify-between bg-[#008c7f] rounded-2xl text-base md:text-lg text-[#e0e0e0] p-5 gap-3 shadow-lg'>
            
            {/* Left Section */}
            <div className='flex items-center gap-4 sm:gap-5'>
              <img
                src='/language-icon.png'
                alt='Language Icon'
                className='w-6 h-6 md:w-7 md:h-7 filter invert brightness-[200%]'
              />
              <div className='flex flex-col leading-tight'>
                <h1 className='text-base md:text-lg font-bold'>Change Language</h1>
                <p className='text-xs md:text-sm'>Select your preferred language</p>
              </div>
            </div>

            {/* Right Section: Select Box */}
            <select
              name='lang'
              id='lang'
              className='w-[100px] md:w-[125px] h-[40px] rounded-xl text-xs md:text-sm appearance-none cursor-pointer text-[#009688] text-center bg-white focus:outline-none'
            >
              <option value='english'>English</option>
              <option value='filipino'>Filipino</option>
            </select>
          </div>

          {/* Report Bug */}
          <div className='flex w-full sm:w-[90%] md:w-[70%] lg:w-[50%] h-auto min-h-[75px] flex-col sm:flex-row lg:items-center justify-between bg-[#008c7f] rounded-2xl text-base md:text-lg text-[#e0e0e0] p-5 gap-3 shadow-lg'>
            
            {/* Left Section */}
            <div className='flex items-center gap-4 sm:gap-5'>
              <img
                src='/bug-icon.png'
                alt='Bug Icon'
                className='w-6 h-6 md:w-7 md:h-7 filter invert brightness-[200%]'
              />
              <div className='flex flex-col leading-tight'>
                <h1 className='text-base md:text-lg font-bold'>Report Bug</h1>
                <p className='text-xs md:text-sm'>Help us improve Ulat PH by reporting issues</p>
              </div>
            </div>

            {/* Right Section: Button */}
            <button className='flex items-center justify-center w-[100px] md:w-[125px] h-[40px] font-bold bg-[#ff2c2c] rounded-xl text-xs md:text-sm cursor-pointer shadow-[0_2px_2px_rgba(0,0,0,0.5)] gap-1'>
              Report a Bug
            </button>
          </div>

          {/* Developer */}
          <div className='flex w-full sm:w-[90%] md:w-[70%] lg:w-[50%] h-auto min-h-[75px] flex-col sm:flex-row lg:items-center justify-between bg-[#008c7f] rounded-2xl text-base md:text-lg text-[#e0e0e0] p-5 gap-3 shadow-lg'>
            
            {/* Left Section */}
            <div className='flex items-center gap-4 sm:gap-5'>
              <img
                src='/user-icon.png'
                alt='User Icon'
                className='w-6 h-6 md:w-7 md:h-7 filter invert brightness-[200%]'
              />
              <div className='flex flex-col leading-tight'>
                <h1 className='text-base md:text-lg font-bold'>Developer</h1>
                <p className='text-xs md:text-sm'>Miguel Ivan Calarde</p>
              </div>
            </div>

            {/* Right Section: Social Links */}
            <div className='flex items-center gap-4 sm:gap-5 filter invert brightness-[200%]'>
              <a href='https://github.com/vnclrd' target='_blank' rel='noopener noreferrer'>
                <img src='/github-logo.png' alt='GitHub' className='w-7 h-7 md:w-10 md:h-10' />
              </a>
              <a href='https://www.linkedin.com/in/vnclrd/' target='_blank' rel='noopener noreferrer'>
                <img src='/linkedin-logo.png' alt='LinkedIn' className='w-7 h-7 md:w-10 md:h-10' />
              </a>
              <a href='https://vnclrd.github.io/miguel-portfolio/' target='_blank' rel='noopener noreferrer'>
                <img src='/portfolio-website-icon.png' alt='Portfolio' className='w-7 h-7 md:w-10 md:h-10' />
              </a>
            </div>
          </div>
          
          {/* About */}
          <div className='flex w-full sm:w-[90%] md:w-[70%] lg:w-[50%] h-auto min-h-[75px] flex-col sm:flex-row lg:items-center justify-between bg-[#008c7f] rounded-2xl text-base md:text-lg text-[#e0e0e0] p-5 gap-3 shadow-lg'>
            
            {/* Left Section */}
            <div className='flex items-center gap-4 sm:gap-5'>
              <img
                src='/about-icon.png'
                alt='About Icon'
                className='w-6 h-6 md:w-7 md:h-7 filter invert brightness-[200%]'
              />
              <h1 className='text-base md:text-lg font-bold'>About</h1>
            </div>

            {/* Right Section */}
            <div className='flex text-left w-full sm:w-[300px] md:w-[500px] h-auto text-xs md:text-sm lg:text-right'>
              <p>
                Ulat PH is a community-driven reporting web app that enables civilians
                to crowdsource and track local community issues.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== Footer ================================================== */}
      <footer className='fixed flex justify-around items-center w-full h-[75px] bottom-0 bg-[#008377] p-3 sm:p-5 md:p-5 lg:p-5 z-1000 dark:bg-[#141b2b]'>
        
        {/* ========================= Reports Button ========================= */}
        <button
          className={`${baseButtonClassesFooter} ${
            activeDiv === 'div1' 
              ? 'bg-[#006057] text-white rounded-[15px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] dark:bg-[#18233a]' 
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
              ? 'bg-[#006057] text-white rounded-[15px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] dark:bg-[#18233a]' 
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
              ? 'bg-[#006057] text-white rounded-[15px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] dark:bg-[#18233a]' 
              : 'bg-transparent text-[#e0e0e0]'
          }`}
          onClick={() => setActiveDiv('div3')}
        >
          <img src='/make-report-icon.png' alt='Make Report Icon' className='w-[25px] h-[25px] filter invert' />
          <p className='font-light text-xs sm:text-sm md:text-sm lg:text-sm mt-[1px]'>Make Report</p>
        </button>

        {/* ========================= Settings Button ========================= */}
        <button
          className={`${baseButtonClassesFooter} ${
            activeDiv === 'div4' 
              ? 'bg-[#006057] text-white rounded-[15px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] dark:bg-[#18233a]' 
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