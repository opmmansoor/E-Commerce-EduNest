import React from "react";
import Hero from "../Components/Hero";
import ProductCard from "../Components/ProductCard";
import { ArrowRight,NotebookIcon,BookOpen,Pencil,GraduationCap, Notebook } from "lucide-react";


function Home() {

  const product = {
    id: "1",
    name: "Premium Notebook",
    category: "Notebooks",
    icon: NotebookIcon,
    price: 299,
    stock: 25,
    image: "/Products/Books/premium2.jpg",
  }

  const categories = [
    {
      title: "Notebooks",
      description: "Premium notebooks for your everyday learning.",
      icon: BookOpen,
      color: "bg-violet-100",
      iconColor: "text-[#3D348B]",
    },
    {
      title: "Stationery Items",
      description: "Pens, pencils, and everything you need to write.",
      icon: Pencil,
      color: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Study Materials",
      description: "Essential tools to make studying easier.",
      icon: GraduationCap,
      color: "bg-purple-100",
      iconColor: "text-purple-700",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAF8FF]">
      <div>
       <div className="w-full">
        <img 
          src="/image/BG.png" 
          alt="EduNest stationery collection" 
          className="block h-auto w-full object-cover"/>
       </div>
      </div>

      <Hero />

     {/* Welcome Section */}
      <section className="relative overflow-hidden px-5 py-16 sm:px-8 lg:py-24">
        <div className="pointer-events-none absolute -right-20 -top-16 h-72 w-72 rounded-full bg-yellow-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">

          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3D348B] shadow-sm ring-1 ring-violet-100">
              <span className="h-2 w-2 rounded-full bg-[#F7B801]" />
              Your trusted study companion
            </span>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Welcome to{" "}
              <span className="text-[#3D348B]">EduNest</span>
              <span className="text-[#F7B801]">!</span>
            </h1>

            <p className="max-w-lg text-base leading-8 text-gray-600 sm:text-lg">
              Everything you need for your school studies, all in one place.
              Discover quality notebooks, stationery, and study essentials
              designed to make learning better.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-[#3D348B] px-6 py-3.5 font-semibold text-white  shadow-lg shadow-violet-200transition hover:-translate-y-1 hover:bg-[#2f286e]"
              >
                Explore Products
                <ArrowRight size={18} />
              </a>

              <a
                href="/about"
                className="rounded-xl border border-violet-200 bg-white px-6 py-3.5 font-semibold text-[#3D348B] transition hover:bg-violet-50"
              >
                About EduNest
              </a>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-4 text-sm font-medium text-gray-600">
              <span>✓ Quality Essentials</span>
              <span>✓ Student Friendly</span>
              <span>✓ Everyday Value</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-4 rotate-6 rounded-[2rem] bg-[#F7B801]/30" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-2xl shadow-violet-200/60">
              <img
                src="/image/BG-1.jpg"
                alt="Discover study essentials at EduNest"
                className="h-72 w-full rounded-[1.5rem] object-cover sm:h-96"
              />
              <div className="absolute bottom-7 left-7 right-7 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
                <p className="text-sm font-medium text-gray-500">
                  Make every study session count
                </p>
                <p className="mt-1 text-lg font-bold text-[#3D348B]">
                  Learn Better. Achieve More.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>


      <div className="px-4 sm:px-8">
        <img 
            src="/image/c.png" 
            alt="Explore EduNest study essentials" 
            className="mx-auto max-h-96 w-full max-w-7xl rounded-3xl object-cover shadow-md"/>
      </div>

 {/* Categories Section */}
    <section className="px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#3D348B]">
              Find your essentials
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Shop by Category
            </h2>

            <p className="mt-3 max-w-xl leading-7 text-gray-600">
              Everything you need to organize your school life and reach
              your learning goals.
            </p>
          </div>

          <a href="/products"
              className="inline-flex items-center gap-2 font-semibold text-[#3D348B] hover:text-[#F7B801]">
            View All Products <ArrowRight size={18} />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return(
              <a href="/products"
              key={category.title}
              className="group rounded-3xl border border-violet-100 bg-white p-7 shadow-sm transition 
                        duration-300 hover:-translate-y-2 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/70"
              >

                <div 
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl
                                ${category.color} transition group-hover:scale-110`}>
                  <Icon size={28} className={category.iconColor} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 transition group-hover:text-[#3D348B]">
                  {category.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-500">
                  {category.description}
                </p>

                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-[#3D348B]">
                  Explore Category
                  <ArrowRight size={17}
                        className="transition group-hover:translate-x-1"
                        />
                </span>
              </a>
            );
          })}
        </div>
      </div>

    </section>



       
      

{/* Featured Products */}
      <section className="bg-gradient-to-b from-violet-100/70 to-[#FAF8FF] px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 text-center">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3D348B] shadow-sm">
              Hand picked for students
            </span>

            <h2 className="mt-5 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Featured Products
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-600">
              Discover everyday essentials that bring quality and convenience
              to your study table.
            </p>
          </div>

          <div className="mx-auto grid max-w-sm grid-cols-1 gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-4">
            <ProductCard product={product} />
          </div>

          <div className="mt-10 text-center" >

            <a href="/products"
               className="inline-flex items-center gap-2 rounded-xl bg-[#3D348B] px-7 py-3.5 
                          font-semibold text-white transition hover:bg-[#2f286e]">
              Shop All Products
              <ArrowRight size={18}/>
            </a>
          </div>

        </div>
      </section>  


{/* Bottom Call to Action */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between 
                        gap-6 rounded-3xl bg-[#3D348B] px-6 py-10 text-center shadow-xl shadow-violet-200 sm:px-12 md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              Ready to upgrade your study essentials?
            </h2>
            
            <p className="mt-3 leading-7 text-violet-100">
              Find your favourites and make every day a productive one.
            </p>
          </div>

          <a href="/products"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#F7B801] px-6 py-3.5 font-bold 
                          text-[#29235e] transition hover:-translate-y-1 hover:bg-yellow-300">
            Start Shopping <ArrowRight size={18} />
          </a>
        </div>
      </section>           

    </main>
  );
}

export default Home;
