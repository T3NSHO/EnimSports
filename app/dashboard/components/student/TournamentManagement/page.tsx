"use client";
import React from "react";

import type { NextPage } from "next";
import { useState, useEffect } from "react";
import TournamentTable from "@/app/components/HeroSection/Navbare/UpcomingTournments/page";
import OngoingTournamentTable from "@/app/components/HeroSection/Navbare/OngoingTournments/page";

import {
  Webcam,
  CircleArrowRight,
  CircleArrowOutUpRight,
  Medal,
} from "lucide-react";

interface Tournament {
  id: number;
  name: string;
  status: "upcoming" | "ongoing" | "completed";
  startDate: string;
  endDate: string;
}

const TournamentManagement = () => {
  const [isUpcomingVisible, setIsUpcomingVisible] = useState(false);
  const [isOngoingVisible, setIsOngoingVisible] = useState(false);

  const handleUpcoming = () => {
    setIsOngoingVisible(false);
    setIsUpcomingVisible(!isUpcomingVisible);
  };
  const handleOngoing = () => {
    setIsUpcomingVisible(false);
    setIsOngoingVisible(!isOngoingVisible);
  };
  return (
    <div className="min-h-screen rounded-2xl bg-gray-900 py-5 px-4 md:px-8 lg:px-16">
      <h1 className="flex gap-2 text-3xl font-bold mb-2 text-green-500 justify-center">
        <Medal size={32} /> Tournament Management
      </h1>
      <div className="flex justify-center flex-col md:flex-row gap-6 py-4">
        {/* Ongoing Tournaments Button */}
        <button
          onClick={handleOngoing}
          className="w-full md:w-1/2 lg:w-1/3 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-xl transition duration-200 flex flex-col items-start text-left focus:outline-none border-l border-t border-emerald-600 sm:p-6"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200">
              <CircleArrowOutUpRight className="text-green-500 " />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-green-500 transition duration-200">
              Ongoing Tournaments
            </h2>
          </div>
        </button>

        {/* Upcoming Tournaments Button */}
        <button
          onClick={handleUpcoming}
          className="w-full md:w-1/2 lg:w-1/3 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-xl transition duration-200 flex flex-col items-start text-left focus:outline-none border-l border-t border-emerald-600 sm:p-6"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200">
              <CircleArrowRight className="text-green-500 " />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-green-500 transition duration-200">
              Upcoming Tournaments
            </h2>
          </div>
        </button>
      </div>

      {/* Display Upcoming Tournaments Table */}
      {isUpcomingVisible && (
        <div className=" bg-gray-950 rounded-md">
          <TournamentTable />
        </div>
      )}

      {/* Display Ongoing Tournaments Table with Score Box */}
      {isOngoingVisible && (
        <div className="mt-8">
          {/* Ongoing Tournament Table */}
          <div className="bg-gray-950 rounded-md">
            <OngoingTournamentTable />
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentManagement;
