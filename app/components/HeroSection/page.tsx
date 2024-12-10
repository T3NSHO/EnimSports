"use client";
import React from "react";
import * as Svg from "@/public/svg.js";

function HeroSection() {
  const features = [
    "Simple and quick scheduling",
    "Beautiful live and continuous display",
    "Online reservation",
  ];

  return (
    <div className="container mx-auto p-5">
      <div className=" p-5 rounded-lg">
        <section className="flex flex-col md:flex-row items-center">
          <img
            className="hidden md:block w-full z-10 relative md:w-1/2 h-auto rounded-lg"
            src="/enimSportsFootball.png"
            alt="Football"
          />
          <div className="md:pl-5 mt-5 md:mt-0">
            <div className="flex space-x-2 mb-5">
              <button className="btn bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 hover:text-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-trophy mr-2"
                  viewBox="0 0 16 16"
                >
                  {Svg.SvgTrophyPath}
                </svg>
                E-SPORT
              </button>

              <button className="btn bg-blue-600 hover:bg-blue-700 hover:text-gray-200 text-white py-2 px-4 rounded-lg flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-trophy mr-2"
                  viewBox="0 0 16 16"
                >
                  {Svg.SvgTrophyPath}
                </svg>
                SPORT
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-5">
              Schedule your <br /> next future{" "}
              <span className="text-blue-500">KOOORA</span> <br /> tournament
              with <span className="text-blue-500">ENIMSPORTS</span>
            </h2>

            <div className="features-list mb-5">
              {features.map((feature, index) => (
                <div className="flex items-center mb-2" key={index}>
                  <span className="text-green-500 mr-2">✔</span>
                  <p className="text-gray-300">{feature}</p>
                </div>
              ))}
            </div>
            <button className="btn bg-blue-600 hover:bg-blue-700 hover:text-gray-200 text-white py-2 px-4 rounded-lg flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trophy mr-2"
                viewBox="0 0 16 16"
              >
                {Svg.SvgTrophyPath}
              </svg>
              Create a tournament for free
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HeroSection;
