import React from 'react'
import Navbar from './Navbar'
import Hero from './Hero'


function Home() {

    

  return (
    <div className='min-h-screen bg-gray-50'>
        <Navbar/>
        <Hero/>

        <section className='relative overflow-hidden bg-[#3D348B]'>
            <div className='max-w-7xl mx-auto px-6 py-16 lg:py-20'>
                <span>
                    <img  className='w-100'
                          src='/image/LOGO.png' alt="LOGO" />
                </span>
                <span className='py-25 font-bold font-poppins text-5xl text-[#F7B801]'>
                    Welcome to EduNest!
                </span>
                <p>
                    Everything you need for your school studies.
                </p>
            </div>
        </section>
            <img src="/image/BG-1.jpg" alt="bg" 
                         className='w-full'/>

            <div>
                <div>
                    <h3>
                        Books
                    </h3>
                    <p>
                        Find useful books for your studies.
                    </p>
                </div>

                <div>
                    <h3>
                        Stationery
                    </h3>
                    <p>
                        Get all your essential stationery items.
                    </p>
                </div>

                <div>
                    <h3>
                        Study Materials
                    </h3>
                    <p>
                        Explore materials that help you learn better.
                    </p>
                </div>
                
            </div>
        
    </div>
  )
}

export default Home
