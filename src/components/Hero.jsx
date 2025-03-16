import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import heroImage from "/src/assets/hero.png";

const Hero = () => {
  return (
    <section id="home" className="container mx-auto flex flex-col md:flex-row justify-between items-center pt-44 pb-6 px-4 sm:px-6 lg:px-8">

      {/* left column */}
      <div className=" w-full md:w-1/2 space-y-8">
        {/* emoji(star) badge */}
        <div className="flex items-center gap-2 bg-gray-50 w-fit px-4 py-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer group">
          <span className=" text-red-800 group-hover:text-red-800 group-hover:scale-125 transition-transform">
            ★
          </span>
          <span className=" text-sm font-medium">Welcome to my page!</span>
        </div>

        <h1 className=" text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Welcome to my portfolio!
          <span className="text-red-800 relative inline-block">
            This is my work!
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-200/60"></span>
          </span>
          <span className="inline-block ml-2 animate-[pulse_4.5s_ease-in-out_infinite]">📸</span>
        </h1>

        <p className=" text-gray-600 text-lg md:text-xl max-w-xl">
          I am a web developer with a passion for creating beautiful and
          functional websites.
        </p>

        <div className="flex gap-3 max-w-md ">
          <input
            type="email"
            placeholder="Email address"
            className="flex-1 px-6  py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-100 transition-all"
          />
          <button className="bg-red-800 backdrop-blur-md font-extrabold text-white px-8 py-4 rounded-xl hover:bg-red-900 cursor-pointer transition-all hover:shadow-lg hover shadow-red-300">
            <FaArrowRight />{" "}
          </button>
        </div>
      </div>

      {/* right column */}
      <div className=" w-full md:w-1/2 mt-16 md:mt-0 pl-0 md:pl-12 ">
      <div className=" relative">
        <img src={heroImage} alt="hero image"      className="rounded-lg relative z-10 hover:scale-[1.02] transition-transform duration-300"
        />
      </div>
      </div>
    </section>
  );
};

export default Hero;
