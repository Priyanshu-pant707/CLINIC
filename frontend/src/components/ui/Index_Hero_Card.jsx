import React from 'react'
import { useState } from 'react'

const Card = () => {

  const [HospitalId, setHospitalId] = useState("");

  return (
    <div
      className='w-full bg-gray-50 border p-5 rounded-lg shadow-md'
    >
      <h1 className='text-2xl font-medium'>Access You Clinic</h1>
      <p className='text-gray-500'>Enter your clinic's App ID or search by name</p>


      <div className='mt-3 '>
        <input
          type="text"
          placeholder="Enter Clinic App ID (e.g., APOLLO2024)"
          value={HospitalId}
          className="border border-gray-300 rounded-sm w-[60%] p-2 focus:outline-none focus:ring-0 focus:border-gray-400"

          onChange={(e) => setHospitalId(e.target.value.toUpperCase())}
        />
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5  ml-6 py-2 rounded-xl shadow-md transition-all duration-300">
          Access
        </button>
      </div>

      <div className='mt-4'>
         <button 
         variant="link"
          //  onClick={() => navigate('/clinics')}
         className=" text-blue-500 font-semibold px-5  ml-6 py-2 rounded-xl hover:text-blue-600 transition-all duration-300">
           या नाम से खोजें / Or search by clinic name →
        </button>
      </div>



    </div>
  )
}

export default Card