"use client";
import React, { useState, useEffect } from "react";
import { Clock, Filter, ChevronDown, Eye } from "lucide-react";

interface MatchDetails {
  id: number;
  team1: string;
  team2: string;
  scoreTeam1: number;
  scoreTeam2: number;
  time: string;
  gameType: string;
  status: string;
  additionalDetails: {
    [key: string]: string | number | { [key: string]: string | number };
  };
}

export default function TournamentTable() {
  const [filter, setFilter] = useState<string>("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
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

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Live":
        return "bg-red-800 text-red-100";
      case "Finished":
        return "bg-green-900 text-green-100";
      default:
        return "bg-gray-800 text-gray-100";
    }
  };

  const renderMatchDetailsModal = (): JSX.Element | null => {
    if (!selectedMatch) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] px-4">
        <div className="bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-500">
                Match Details
              </h2>
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-between mb-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-200">
                  {selectedMatch.team1}
                </h3>
                <p className="text-2xl font-bold text-blue-500">
                  {selectedMatch.scoreTeam1}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-200">
                  {selectedMatch.team2}
                </h3>
                <p className="text-2xl font-bold text-red-500">
                  {selectedMatch.scoreTeam2}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-500 mb-2">
                  Match Info
                </h4>
                {Object.entries(selectedMatch.additionalDetails).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between text-sm text-gray-200"
                    >
                      <span className="capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      {typeof value === "object" ? (
                        Object.entries(value).map(([k, v]) => (
                          <span key={k} className="capitalize">
                            {k}: {v}
                          </span>
                        ))
                      ) : (
                        <span>{value}</span>
                      )}
                    </div>
                  )
                )}
              </div>
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
      <div className="px-5 mt-5 md:px-8 lg:px-40  md:pt-4 text-white min-h-screen pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-xl  lg:text-2xl font-semibold text-gray-100 w-full sm:text-left">
            Ongoing Tournament Scoreboard
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

          <div className="sm:hidden w-full">
            <div
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2 cursor-pointer"
            >
              <span className="text-gray-100">{filter}</span>
              <ChevronDown className="text-gray-400" />
            </div>
            {isMobileMenuOpen && (
              <div className="absolute left-0 right-0 mx-4 mt-2 bg-gray-800 rounded-lg shadow-lg z-50">
                {gameTypes.map((type) => (
                  <div
                    key={type}
                    onClick={() => {
                      setFilter(type);
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-700 text-gray-100 cursor-pointer"
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1  lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredScores.length === 0 && (
            <div className="text-center py-12">
              <p className="text-base sm:text-xl text-gray-500">
                No events found for this category
              </p>
            </div>
          )}
          {filteredScores.map((event, index) => (
            <div
              key={`${event.id}-${index}`}
              className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-700">
                <span className="bg-blue-900 text-blue-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                  {event.gameType}
                </span>
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ${getStatusColor(
                    event.status
                  )}`}
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
                    <p className="text-sm font-bold text-gray-200 mb-1 sm:mb-2 ">
                      {event.team2}
                    </p>
                    <p className="text-xl sm:text-3xl font-extrabold text-red-500">
                      {event.scoreTeam2}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 sm:mt-4">
                  <div className="flex items-center">
                    <Clock className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="text-xs sm:text-sm text-gray-300 font-medium">
                      Match Time: {event.time}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedMatch(event)}
                    className="flex items-center bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    See Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {renderMatchDetailsModal()}
      </div>
    </>
  );
}
