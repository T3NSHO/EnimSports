"use client";
import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MatchDetails {
  _id: string; // MongoDB ObjectId
  id: number; // Optional local identifier
  team1: string;
  team2: string;
  scoreTeam1: number;
  scoreTeam2: number;
  time: string;
  gameType: string;
  status: string;
  additionalDetails: Record<string, string | number | Record<string, string | number>>;
}

export default function TournamentAdminPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("All");
  const [selectedMatch, setSelectedMatch] = useState<MatchDetails | null>(null);
  const [scores, setScores] = useState<MatchDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch("/api/get_all_matches", {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch match data");
        }
        const data = await response.json();
        setScores(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  const gameTypes: string[] = [
    "All",
    ...new Set(scores.map((event) => event.gameType)),
  ];

  const filteredScores =
    filter === "All"
      ? scores
      : scores.filter((event) => event.gameType === filter);

  const handleUpdateMatch = async (_id: string, updates: Partial<MatchDetails>) => {
    try {
      const response = await fetch(`/api/update_match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id, ...updates }),
      });

      if (!response.ok) {
        throw new Error("Failed to update match");
      }

      const updatedMatch = await response.json();

      // Update the scores immutably
      setScores((prevScores) =>
        prevScores.map((match) =>
          match._id === _id ? { ...match, ...updates } : match
        )
      );

      setSelectedMatch(null);

      toast({
        title: "Success",
        description: "Match updated successfully!",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update match",
        variant: "destructive",
      });
    }
  };

  const renderMatchDetailsModal = (): JSX.Element | null => {
    if (!selectedMatch) return null;

    const handleChange = (field: keyof MatchDetails, value: any) => {
      setSelectedMatch((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleSave = () => {
      if (selectedMatch) {
        handleUpdateMatch(selectedMatch._id, {
          status: selectedMatch.status,
          scoreTeam1: selectedMatch.scoreTeam1,
          scoreTeam2: selectedMatch.scoreTeam2,
          time: selectedMatch.time,
        });
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] px-4">
        <div className="bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-500">Edit Match</h2>
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-500 mb-2">
                  Match Info
                </h4>
                <div className="flex flex-col space-y-2">
                  <label className="text-gray-200 text-sm">Status</label>
                  <select
                    value={selectedMatch.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="finished">Finished</option>
                  </select>

                  <label className="text-gray-200 text-sm">Team 1 Score</label>
                  <input
                    type="number"
                    value={selectedMatch.scoreTeam1}
                    onChange={(e) =>
                      handleChange("scoreTeam1", Number(e.target.value))
                    }
                    className="bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none"
                  />

                  <label className="text-gray-200 text-sm">Team 2 Score</label>
                  <input
                    type="number"
                    value={selectedMatch.scoreTeam2}
                    onChange={(e) =>
                      handleChange("scoreTeam2", Number(e.target.value))
                    }
                    className="bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none"
                  />

                  <label className="text-gray-200 text-sm">Match Time</label>
                  <input
                    type="datetime-local"
                    value={selectedMatch.time}
                    onChange={(e) => handleChange("time", e.target.value)}
                    className="bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2 rounded-lg mt-4"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading matches...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <>
      <div className="px-5 mt-5 md:px-8 lg:px-40 md:pt-4 text-white min-h-screen pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-100 w-full sm:text-left">
            Tournament Admin Panel
          </h1>

          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex items-center bg-gray-800 shadow-md rounded-full px-4 py-2">
              <Filter className="mr-2 text-gray-400" size={20} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent text-gray-100 focus:outline-none"
              >
                {gameTypes.map((type) => (
                  <option
                    key={type}
                    value={type}
                    className="bg-gray-800 text-gray-100"
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredScores.length === 0 && (
            <div className="text-center py-12">
              <p className="text-base sm:text-xl text-gray-500">
                No matches found for this category
              </p>
            </div>
          )}
          {filteredScores.map((event) => (
            console.log(event),
            <div
              key={event._id} // Ensure unique _id as key
              className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-700">
                <span className="bg-blue-900 text-blue-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                  {event.gameType}
                </span>
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ${event.status}`}
                >
                  {event.status}
                </span>
              </div>

              <div className="px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="flex flex-col items-center w-1/3">
                    <p className="text-sm font-bold text-gray-200 mb-1 sm:mb-2 text-center">
                      {event.team1}
                    </p>
                    <p className="text-xl sm:text-3xl font-extrabold text-blue-500">
                      {event.scoreTeam1}
                    </p>
                  </div>

                  <div className="text-lg sm:text-2xl font-bold text-gray-500 w-1/3 text-center">
                    VS
                  </div>

                  <div className="flex flex-col items-center w-1/3">
                    <p className="text-sm font-bold text-gray-200 mb-1 sm:mb-2">
                      {event.team2}
                    </p>
                    <p className="text-xl sm:text-3xl font-extrabold text-red-500">
                      {event.scoreTeam2}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMatch(event)} // Trigger state change here
                  className="w-full bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm sm:text-base"
                >
                  Edit Match
                </button>
              </div>
            </div>
          ))}
        </div>

        {renderMatchDetailsModal()}
      </div>
    </>
  );
}
