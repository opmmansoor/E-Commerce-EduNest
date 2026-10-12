
import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  X,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#211B4D] text-white">

      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Make learning <span className="text-[#F7B801]">better!</span>
            </h2>
            <p className="mt-2 text-sm leading-6 text-violet-200">
              Find everything you need for your next great idea.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-[#F7B801] px-6 py-3 font-bold text-[#211B4D] transition hover:-translate-y-1 hover:bg-yellow-300"
          >
            Explore Products <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <Link to="/home" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7B801] text-[#211B4D]">
              <BookOpen size={27} />
            </div>

            <span className="text-2xl font-extrabold tracking-tight">
              Edu<span className="text-[#F7B801]">Nest</span>
            </span>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-7 text-violet-200">
            Your trusted destination for quality notebooks, stationery,
            school accessories, and everyday study essentials.
          </p>

          <div className="mt-6 flex gap-3">
            {/* <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-[#F7B801] hover:text-[#211B4D]"
            >
              <Instagram size={19} />
            </a> */}

            <a
              href="https://www.X.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-[#F7B801] hover:text-[#211B4D]"
            >
              <X size={19} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold">Quick Links</h3>
          <div className="mt-5 flex flex-col gap-4 text-sm text-violet-200">
            <Link to="/home" className="transition hover:text-[#F7B801]">
              Home
            </Link>
            <Link to="/products" className="transition hover:text-[#F7B801]">
              All Products
            </Link>
            <Link to="/about" className="transition hover:text-[#F7B801]">
              About Us
            </Link>
            <Link to="/Cart" className="transition hover:text-[#F7B801]">
              Shopping Cart
            </Link>
            <Link to="/wishlist" className="transition hover:text-[#F7B801]">
              Wishlist
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-bold">Our Categories</h3>
          <div className="mt-5 flex flex-col gap-4 text-sm text-violet-200">
            <Link to="/products" className="transition hover:text-[#F7B801]">
              Notebooks & Diaries
            </Link>
            <Link to="/products" className="transition hover:text-[#F7B801]">
              Pens & Pencils
            </Link>
            <Link to="/products" className="transition hover:text-[#F7B801]">
              Geometric Instruments
            </Link>
            <Link to="/products" className="transition hover:text-[#F7B801]">
              School Accessories
            </Link>
            <Link to="/products" className="transition hover:text-[#F7B801]">
              Study Materials
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold">Contact Us</h3>

          <div className="mt-5 flex flex-col gap-5 text-sm text-violet-200">
            <div className="flex items-start gap-3">
              <Mail size={19} className="mt-0.5 shrink-0 text-[#F7B801]" />
              <a
                href="mailto:support@edunest.com"
                className="break-all transition hover:text-[#F7B801]"
              >
                support@edunest.com
              </a>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={19} className="mt-0.5 shrink-0 text-[#F7B801]" />
              <a
                href="tel:+910000000000"
                className="transition hover:text-[#F7B801]"
              >
                Contact Support
              </a>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={19} className="mt-0.5 shrink-0 text-[#F7B801]" />
              <p>India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-center text-xs text-violet-300 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} EduNest. All rights reserved.
          </p>

          <p>
            Made with <span className="text-[#F7B801]">♥</span> for learners.
          </p>
        </div>
      </div>

    </footer>
  );
}

export default Footer;
