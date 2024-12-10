"use client";
import React, { useState } from "react";
import {
  Calendar,
  Volleyball,
  Dribbble,
  LandPlot,
  CalendarCheck,
  CalendarOff,
} from "lucide-react";

const fieldTypes = [
  { type: "Football", id: 3, Icon: LandPlot, imgSrc: "football.avif" },
  { type: "Basketball", id: 2, Icon: Dribbble, imgSrc: "basketBall.webp" },
  { type: "Volleyball", id: 1, Icon: Volleyball, imgSrc: "Volleyball.jpeg" },
];

const generate24HourTimes = () =>
  Array.from({ length: 24 }, (_, i) => ({
    hourState: false,
    id: i,
    hour: i.toString().padStart(2, "0") + ":00",
  }));

function ReservationSystem() {
  const [timeSlots, setTimeSlots] = useState(generate24HourTimes());
  const [reservations, setReservations] = useState({
    count: 0,
    reservedHours: [],
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const userName = "Walid";

  const handleFieldSelection = (field) => {
    setSelectedField(field);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    // Reset states to default when a new date is selected
    setTimeSlots(generate24HourTimes());
    setReservations({
      count: 0,
      reservedHours: [],
    });
  };

  const handleReserve = (hourId) => {
    if (
      reservations.count >= 2 &&
      !reservations.reservedHours.includes(hourId)
    ) {
      return;
    }

    setTimeSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.id === hourId ? { ...slot, hourState: !slot.hourState } : slot
      )
    );

    setReservations((prev) => {
      const isAlreadyReserved = prev.reservedHours.includes(hourId);
      return {
        count: isAlreadyReserved ? prev.count - 1 : prev.count + 1,
        reservedHours: isAlreadyReserved
          ? prev.reservedHours.filter((id) => id !== hourId)
          : [...prev.reservedHours, hourId],
      };
    });
  };

  // Get the selected field image source
  const selectedFieldData = fieldTypes.find(
    (field) => field.type === selectedField
  );
  const imgSrc = selectedFieldData ? selectedFieldData.imgSrc : null;

  return (
    <div className="space-y-5 w-full max-w-screen-xl mx-auto px-4">
      <header className="flex flex-wrap justify-center space-x-1 text-2xl sm:text-4xl font-bold text-green-400 mb-4 text-center">
        <Calendar className="text-green-400" />
        <h1>Reservation System</h1>
      </header>
      <main className="space-y-5">
        <section className="flex flex-wrap justify-center space-x-2">
          {fieldTypes.map(({ id, type, Icon }) => (
            <button
              key={id}
              onClick={() => handleFieldSelection(type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-lg ${
                selectedField === type
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                  : "bg-gray-500 text-gray-300"
              }`}
            >
              <Icon className="text-white" />
              {type}
            </button>
          ))}
        </section>
        {selectedField && (
          <div className="flex gap-4 items-center">
            <section>
              <input
                type="date"
                className="w-full bg-green-900 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleDateChange}
              />
            </section>
            {reservations.count > 0 && (
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25">
                Save Reservation
              </button>
            )}
          </div>
        )}
        {selectedDate && (
          <section className="bg-gray-600 p-3 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="bg-gray-800 rounded-sm p-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              <div></div>
              {timeSlots.map(({ id, hour, hourState }) => (
                <div
                  className={`${
                    hourState ? "bg-red-700" : "bg-green-700"
                  } rounded-md text-center px-1 py-3  flex flex-col items-center justify-between`}
                  key={id}
                >
                  <p className="font-bold text-white">{hour}</p>

                  <button
                    onClick={() => handleReserve(id)}
                    className={`px-2  py-1 w-full text-sm bg-gradient-to-r ${
                      hourState
                        ? "from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-red-500/25"
                        : "from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-green-500/25"
                    } `}
                    disabled={reservations.count >= 2 && !hourState}
                  >
                    {hourState ? (
                      <div className="flex items-center justify-center gap-2">
                        <CalendarOff color="white" /> Cancel
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <CalendarCheck color="white" /> Reserve
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
            {imgSrc && (
              <div>
                <h1 className="text-xl sm:text-4xl font-bold text-green-400 mb-1">
                  {selectedField} Field
                </h1>
                <div className="flex justify-center items-center">
                  <img
                    src={`/${imgSrc}`}
                    alt={`${selectedField} field`}
                    className="max-w-full h-auto rounded-md"
                  />
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default ReservationSystem;
