import React from 'react'
import Navbar from './Components/Navbar'

function Home() {

    

  return (
    <div>
        <Navbar/>

        <main>
            <div>
                <h2>
                    Welcome to EduNest!
                </h2>
                <p>
                    Everything you need for your school studies.
                </p>
            </div>

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
