"use client";
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  X,
  UserCircle2,
  Users,
} from "lucide-react";

const girlsTimeSlots = [
  { day: "Monday", time: "6:00 AM - 7:00 AM" },
  { day: "Monday", time: "7:30 AM - 8:30 AM" },
  { day: "Monday", time: "6:00 PM - 7:00 PM" },
  { day: "Tuesday", time: "5:30 AM - 6:30 AM" },
  { day: "Tuesday", time: "4:30 PM - 5:30 PM" },
  { day: "Wednesday", time: "7:00 AM - 8:00 AM" },
  { day: "Wednesday", time: "7:30 PM - 8:30 PM" },
  { day: "Thursday", time: "6:30 AM - 7:30 AM" },
  { day: "Thursday", time: "5:00 PM - 6:00 PM" },
  { day: "Friday", time: "8:00 AM - 9:00 AM" },
  { day: "Friday", time: "7:00 PM - 8:00 PM" },
  { day: "Saturday", time: "9:00 AM - 10:00 AM" },
  { day: "Saturday", time: "10:30 AM - 11:30 AM" },
  { day: "Sunday", time: "8:00 AM - 9:00 AM" },
];

const boysTimeSlots = [
  {
    day: "Monday",
    time: "5:30 AM - 6:30 AM / 7:00 AM - 8:00 AM / 7:00 PM - 8:00 PM",
  },
  { day: "Tuesday", time: "6:00 AM - 7:00 AM / 5:30 PM - 6:30 PM" },
  { day: "Wednesday", time: "6:30 AM - 7:30 AM / 8:00 PM - 9:00 PM" },
  { day: "Thursday", time: "5:00 AM - 6:00 AM / 6:00 PM - 7:00 PM" },
  { day: "Friday", time: "7:30 AM - 8:30 AM / 8:00 PM - 9:00 PM" },
  { day: "Saturday", time: "8:00 AM - 9:00 AM / 9:30 AM - 10:30 AM" },
  { day: "Sunday", time: "9:00 AM - 10:00 AM" },
];

const TimeTableGrid = ({ timeSlots, gender }) => {
  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <div className="bg-gray-700 rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gray-600 p-4 flex items-center justify-center space-x-3">
        {gender === "girls" ? (
          <UserCircle2 className="text-pink-300" size={30} />
        ) : (
          <Users className="text-blue-300" size={30} />
        )}
        <h2 className="text-2xl font-bold text-white">
          {gender === "girls" ? "Girls" : "Boys"} Gym Schedule
        </h2>
      </div>

      {/* Mobile & Tablet View - Scrollable Carousel */}
      <div className="block lg:hidden overflow-x-auto pb-4">
        <div className="inline-flex space-x-4 px-4">
          {Object.keys(timeSlots).map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(selectedDay === day ? null : day)}
              className={`
                flex-shrink-0 w-64 p-4 rounded-lg text-left transition-all duration-300
                ${
                  selectedDay === day
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-600"
                }
              `}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{day}</h2>
                {selectedDay === day ? <X className="text-white" /> : null}
              </div>
              {selectedDay === day && (
                <div className="mt-4 space-y-3">
                  {timeSlots[day].map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-white"
                    >
                      <span>{slot.time}</span>
                      <slot.icon size={20} className={slot.iconColor} />
                    </div>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop View - Full Grid */}
      <div className="hidden lg:grid grid-cols-7 gap-4 p-6">
        {Object.entries(timeSlots).map(([day, slots]) => (
          <div
            key={day}
            className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <h2 className="bg-gray-600 text-white text-center font-bold py-3 text-lg">
              {day}
            </h2>
            <div className="p-4">
              <ul className="space-y-3">
                {slots.map((slot, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="text-sm">{slot.time}</span>
                    <slot.icon size={20} className={slot.iconColor} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GymTimeTable = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <TimeTableGrid timeSlots={girlsTimeSlots} gender="girls" />
        <TimeTableGrid timeSlots={boysTimeSlots} gender="boys" />
      </div>
    </div>
  );
};

export default GymTimeTable;
