import React from "react";

function Description() {
  return (
    <div className="text-center bg-custom-gradient text-white font-sans">
      <header className="py-5">
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <h1 className="text-4xl font-bold">Case Studies</h1>
        <p className="mt-2 text-lg">
          We are proud to work with partners who share our passion for sports.
        </p>
      </header>

      <section className="flex flex-col md:flex-row items-center justify-around p-10">
        <div className="max-w-lg text-left mb-8 md:mb-0">
          <h2 className="text-3xl font-semibold mb-3">
            ENIM SPORTS x Comité Sport
          </h2>
          <p className="text-base mb-8">
            ENIM SPORTS is the leading platform for organizing sports
            tournaments at the École Nationale Supérieure des Mines de Rabat
            (ENIM). In partnership with the Sports Committee, it organizes
            events in collaboration with other schools, offering comprehensive
            and tailored solutions for each competition. Through this
            initiative, participants benefit from an enriching sports
            experience, with end-to-end organization including sports
            facilities, qualified referee teams, catering, and personalized
            equipment.
          </p>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-500 transition duration-200">
              Learn more
            </button>
            <button className="bg-gray-700 text-white py-2 px-4 rounded-lg font-bold hover:bg-gray-600 transition duration-200">
              See all case studies
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            src="./photo.png"
            alt="ENIM Building"
            className="w-80 md:w-96 rounded-lg object-cover"
          />
        </div>
      </section>
    </div>
  );
}

export default Description;
