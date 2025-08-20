import './App.css'

function App() {
  return (
    <div className='flex w-full min-h-screen bg-[#009688] items-center justify-center'>
      
      <div className='flex flex-col items-center justify-center w-[500px] h-[250px]'>
        
        <h1 className='text-[2.5rem] mb-5 text-[#e0e0e0]'>Where are you located?</h1>
        
        <div className='flex'>

          <button className='flex items-center justify-center w-[40px] h-[40px] bg-[#e0e0e0] mr-2.5 border-2 rounded-[25px]'>
            <img src="/public/target-icon.png" alt="Target Logo" className='w-[26px] h-[26px]' />
          </button>

          <input type="text" placeholder='Enter your location' className='w-[300px] h-[40px] bg-[#e0e0e0] border-2 rounded-[25px] pl-5 mr-2.5' />
        
          <button className='flex items-center justify-center w-[40px] h-[40px] bg-[#e0e0e0] border-2 rounded-[25px]'>
            <img src="/public/arrow-icon.png" alt="Target Logo" className='w-[20px] h-[20px]' />
          </button>
        </div>
        
      </div>
    </div>
  )
}

export default App
