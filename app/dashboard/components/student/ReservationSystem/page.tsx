"use client";
import React, { useState, FC, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  Volleyball,
  Dribbble,
  LandPlot,
  CalendarCheck,
  CalendarOff,
  User,
  Clock,
  LucideIcon,
} from "lucide-react";
import { SessionProvider, useSession } from "next-auth/react";

// Refined Type Definitions
interface FieldType {
  type: string;
  id: number;
  Icon: LucideIcon;
  imgSrc: string;
  description: string;
}

interface TimeSlot {
  id: number;
  hour: string;
  hourState: boolean;
  reservedBy: string | null;
}

interface ReservationHour {
  hour: number;
  reservedBy: string;
  phone?: string;
  department?: string;
}

interface Reservation {
  date: string;
  field: string;
  hours: ReservationHour[];
}

interface ReservationsState {
  count: number;
  reservedHours: number[];
}

// Constants

const CURRENT_USER = "AZEMRAY"; // Typically from authentication

const fieldTypes: FieldType[] = [
  {
    type: "Football",
    id: 3,
    Icon: LandPlot,
    imgSrc: "football.avif",
    description: "Outdoor football field with professional-grade turf",
  },
  {
    type: "Basketball",
    id: 2,
    Icon: Dribbble,
    imgSrc: "basketBall.webp",
    description: "Indoor basketball court with premium flooring",
  },
  {
    type: "Volleyball",
    id: 1,
    Icon: Volleyball,
    imgSrc: "Volleyball.jpeg",
    description: "Volleyball court with regulation net and markings",
  },
];

// Generate 24-hour time slots function
const generate24HourTimes = (): TimeSlot[] =>
  Array.from({ length: 24 }, (_, i) => ({
    id: i,
    hour: i.toString().padStart(2, "0") + ":00",
    hourState: false,
    reservedBy: null,
  }));

const ReservationSystem: FC = () => {
  // State Hooks with Explicit Types
  const { data: session, status } = useSession();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(generate24HourTimes());
  const [reservations, setReservations] = useState<ReservationsState>({
    count: 0,
    reservedHours: [],
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [existingReservations, setExistingReservations] = useState<
  Reservation[]
>([]);
  // Enhanced existing reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("/api/get_reservations", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reservations");
        }

        const data: Reservation[] = await response.json();
        setExistingReservations(data);
        console.log("Fetched reservations:", data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  
  const [selectedReservationDetails, setSelectedReservationDetails] =
    useState<ReservationHour | null>(null);

  // Handlers with Explicit Type Annotations
  const handleFieldSelection = (field: string): void => {
    setSelectedField(field);
    setSelectedReservationDetails(null);
  };
  if (!session) {
    return <div>You are not allowed to see this page</div>;
  }

  const user_id = session.user.id as string;
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedDateValue = e.target.value;
    setSelectedDate(selectedDateValue);
    setSelectedReservationDetails(null);

    // Reset time slots
    const freshTimeSlots = generate24HourTimes();

    // Check for existing reservations for this date and field
    const dayReservations = existingReservations.find(
      (reservation) =>
        reservation.date === selectedDateValue &&
        reservation.field === selectedField
    );

    // Mark existing reservations
    if (dayReservations) {
      dayReservations.hours.forEach((reservation) => {
        const slotIndex = freshTimeSlots.findIndex(
          (slot) => parseInt(slot.hour) === reservation.hour
        );

        if (slotIndex !== -1) {
          freshTimeSlots[slotIndex].hourState = true;
          freshTimeSlots[slotIndex].reservedBy = reservation.reservedBy;
        }
      });
    }

    setTimeSlots(freshTimeSlots);
    setReservations({
      count: 0,
      reservedHours: [],
    });
  };

  const handleReserve = (hourId: number): void => {
    // Prevent reserving if already max reservations or slot is taken
    if (
      reservations.count >= 2 &&
      !reservations.reservedHours.includes(hourId)
    ) {
      return;
    }

    setTimeSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.id === hourId
          ? {
              ...slot,
              hourState: !slot.hourState,
              reservedBy: slot.hourState ? null : CURRENT_USER,
            }
          : slot
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

  const handleViewReservationDetails = (slot: {
    id: number;
    hour: string;
  }): void => {
    // Find the matching existing reservation
    const existingReservation = existingReservations.find(
      (reservation) =>
        reservation.date === selectedDate && reservation.field === selectedField
    );

    if (existingReservation) {
      const reservationDetails = existingReservation.hours.find(
        (hour) => hour.hour === slot.id
      );

      setSelectedReservationDetails(reservationDetails || null);
    }
  };

  const handleSaveReservation = async (): Promise<void> => {
    if (!selectedDate || !selectedField || !user_id) {
      alert("Please select both a date and a field before saving reservations.");
      return;
    }
  
    const reservedSlots = timeSlots.filter((slot) => slot.hourState);
  
    if (reservedSlots.length === 0) {
      alert("Please select at least one time slot to reserve.");
      return;
    }
  
    // Prepare the data in the expected format
    const reservationData = reservedSlots.map((slot) => ({
      date: new Date(selectedDate), // Ensure it's in Date format
      field: selectedField,
      hour: slot.id, // Send the slot ID as the hour
      reservedBy: user_id,
      reservedAt: new Date(), // Add the current timestamp
    }));
  
    console.log("Sending reservation data:", reservationData);
  
    try {
      const response = await fetch("/api/save_reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to save reservation");
      }
  
      alert("Reservation saved successfully!");
      // Reset the form
      setTimeSlots(generate24HourTimes());
      setReservations({ count: 0, reservedHours: [] });
      setSelectedDate(null);
    } catch (error) {
      console.error("Error saving reservation:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while saving your reservation"
      );
    }
  };
  
  // Get the selected field image source and description
  const selectedFieldData = fieldTypes.find(
    (field) => field.type === selectedField
  );
  const imgSrc = selectedFieldData ? selectedFieldData.imgSrc : null;
  const fieldDescription = selectedFieldData
    ? selectedFieldData.description
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="space-y-5 w-full max-w-screen-xl mx-auto">
        <header className="flex flex-col items-center justify-center space-y-2 mb-8">
          <div className="flex items-center space-x-3 text-2xl sm:text-4xl font-bold text-green-400">
            <Calendar className="text-green-400" />
            <h1>Field Reservation System</h1>
          </div>
          <p className="text-gray-400 text-center max-w-xl">
            Select a field, choose a date, and reserve your preferred time slots
          </p>
        </header>

        <main className="space-y-6">
          {/* Field Selection */}
          <section className="flex flex-wrap justify-center gap-4">
            {fieldTypes.map(({ id, type, Icon, description }) => (
              <div key={id} className="group relative">
                <button
                  onClick={() => handleFieldSelection(type)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all shadow-lg ${
                    selectedField === type
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <Icon className="text-white" />
                  {type} Field
                </button>
                {selectedField !== type && (
                  <div className="absolute z-10 hidden group-hover:block bg-black text-white text-sm p-2 rounded-md shadow-lg -bottom-14 left-1/2 transform -translate-x-1/2">
                    {description}
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Date and Reservation Controls */}
          {selectedField && (
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <input
                title="SaveReservation"
                type="date"
                className="w-full max-w-xs bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={handleDateChange}
              />
              {reservations.count > 0 && (
                <button
                  onClick={handleSaveReservation}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25"
                >
                  Save Reservation
                </button>
              )}
            </div>
          )}

          {/* Reservation Details and Image */}
          {selectedDate && (
            <section className="bg-gray-800 p-6 rounded-lg grid md:grid-cols-2 gap-6">
              {/* Time Slots */}
              <div className="bg-gray-700 rounded-lg p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {timeSlots.map(({ id, hour, hourState, reservedBy }) => (
                  <div
                    key={id}
                    className={`rounded-md text-center py-2 px-1 flex flex-col items-center justify-between ${
                      hourState ? "bg-red-800" : "bg-green-800"
                    }`}
                  >
                    <p className="font-bold text-white text-sm">{hour}</p>

                    <button
                      onClick={() =>
                        hourState
                          ? handleViewReservationDetails({ id, hour })
                          : handleReserve(id)
                      }
                      className={`w-full py-1 text-xs rounded-md transition-all ${
                        hourState
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      } ${
                        reservedBy && reservedBy !== CURRENT_USER
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      disabled={!!reservedBy && reservedBy !== CURRENT_USER}
                    >
                      {hourState ? (
                        <div className="flex items-center justify-center gap-1">
                          <CalendarOff size={12} />
                          {reservedBy || "Reserved"}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <CalendarCheck size={12} /> Reserve
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Field Image and Details */}
              <div>
                {imgSrc && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                      <LandPlot className="text-green-400" />
                      {selectedField} Field
                    </h2>
                    <div className="rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={`/${imgSrc}`}
                        alt={`${selectedField} field`}
                        width={800}
                        height={500}
                      />
                    </div>

                    <p className="text-gray-400 mt-2">{fieldDescription}</p>
                  </div>
                )}

                {/* Reservation Details Modal */}
                {selectedReservationDetails && (
                  <div className="mt-6 bg-gray-700 rounded-lg p-4 space-y-3">
                    <h3 className="text-xl font-bold text-green-400 flex items-center gap-2">
                      <User className="text-green-400" />
                      Reservation Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <Clock size={16} />
                        <span className="font-semibold">Time:</span>
                        {selectedReservationDetails.hour}:00
                      </p>
                      <p className="flex items-center gap-2">
                        <User size={16} />
                        <span className="font-semibold">Reserved By:</span>
                        {selectedReservationDetails.reservedBy}
                      </p>
                      
                      {selectedReservationDetails.phone && (
                        <p className="flex items-center gap-2">
                          <User size={16} />
                          <span className="font-semibold">Phone:</span>
                          {selectedReservationDetails.phone}
                        </p>
                      )}
                      {selectedReservationDetails.department && (
                        <p className="flex items-center gap-2">
                          <User size={16} />
                          <span className="font-semibold">Department:</span>
                          {selectedReservationDetails.department}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
export default ReservationSystem;