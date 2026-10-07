

import React from 'react'

function About() {
  return (
    <div className='min-h-screen bg-gray-100 px-5 py-10'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
            About  
            <span className='text-[#3D348B]'> Edu</span>
                <span className='text-[#F7B801]'>Nest</span>
        </h1>
        
        <p className='text-gray-600 leading-7'>
            EduNest is an e-commerce platform designed for students.
          We provide premium Notebooks, pens, pencils, Instrument
          boxes, Diaries, Bags and other useful study essentials.
        </p>
      </div>
    </div>
  )
}

export default About
