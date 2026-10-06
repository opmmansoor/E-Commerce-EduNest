import React from 'react'
import Navbar from './Components/Navbar'


function Home() {

    

  return (
    <div>
        <Navbar/>

        <main>
            <div className='flex py-2 px-5 justify-between'>
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
        </main>
    </div>
  )
}

export default Home
