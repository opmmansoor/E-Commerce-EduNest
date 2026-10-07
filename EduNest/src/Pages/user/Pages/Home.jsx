import React from "react";
import Hero from "../Components/Hero";
import ProductCard from "../Components/ProductCard";


function Home() {

  const product = {
    id: "1",
    name: "Premium Notebook",
    category: "Notebooks",
    price: 299,
    stock: 25,
    image: "/images/notebook.jpg",
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <Hero />

      <section className="relative overflow-hidden bg-[#3D348B]">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <span>
            <img className="w-100" src="/image/LOGO.png" alt="LOGO" />
          </span>
          <span className="py-25 font-bold font-poppins text-5xl text-[#F7B801]">
            Welcome to EduNest!
          </span>
          <p>Everything you need for your school studies.</p>
        </div>
      </section>
      <img src="/image/BG-1.jpg" alt="bg" className="w-full" />

      <div>
        <div>
          <h3>Books</h3>
          <p>Find useful books for your studies.</p>
        </div>

        <div>
          <h3>Stationery</h3>
          <p>Get all your essential stationery items.</p>
        </div>

        <div>
          <h3>Study Materials</h3>
          <p>Explore materials that help you learn better.</p>
        </div>
      </div>


     <div className="p-10 bg-gray-100 min-h-screen">

      <div className="max-w-sm">
        <ProductCard product={product} />
      </div>

    </div>

    </div>
  );
}

export default Home;
