"use client";

import React, { useState } from "react";
import {
  Trophy,
  Calendar,
  GamepadIcon,
  Volleyball,
  Circle,
  Users,
  Flag,
  CircleUser,
  PlusCircle,
  Minus,
} from "lucide-react";

const TournamentCreationForm = () => {
  const [tournamentTitle, setTournamentTitle] = useState("");
  const [tournamentPrize, setTournamentPrize] = useState("");
  const [startDate, setStartDate] = useState("");
  const [tournamentType, setTournamentType] = useState("");
  const [sportType, setSportType] = useState("");
  const [esportGame, setEsportGame] = useState("");
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [tournamentFormat, setTournamentFormat] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form data
    const tournamentData = {
      title: tournamentTitle,
      prize: tournamentPrize,
      startDate,
      type: tournamentType,
      sportDetails: tournamentType === "real-sports" ? sportType : esportGame,
      numberOfTeams,
      format: tournamentFormat,
    };
    console.log(" this data will pushed to the DB :", tournamentData);
    try {
      // Example of potential API call in Next.js
      const response = await fetch("/api/tournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tournamentData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Tournament created:", result);
        // Optional: Reset form or redirect
      } else {
        console.error("Failed to create tournament");
      }
    } catch (error) {
      console.error("Error creating tournament:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-full flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Tournament Creation Form */}
        <div className="w-full lg:w-full bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-white flex items-center justify-center">
            <Trophy className="mr-3 text-yellow-500" size={36} />
            Create Tournament
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="tournamentTitle"
                className="flex items-center mb-2 text-sm font-medium text-white"
              >
                <CircleUser className="mr-2" /> Tournament Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="tournamentTitle"
                  value={tournamentTitle}
                  onChange={(e) => setTournamentTitle(e.target.value)}
                  className="pl-10 bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Enter tournament name"
                  required
                />
              </div>
            </div>

            {/* Tournament Prize */}
            <div>
              <label
                htmlFor="tournamentPrize"
                className="flex items-center mb-2 text-sm font-medium text-white"
              >
                <Trophy className="mr-2" /> Prize
              </label>
              <input
                type="text"
                id="tournamentPrize"
                value={tournamentPrize}
                onChange={(e) => setTournamentPrize(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter prize amount"
                required
              />
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="flex items-center mb-2 text-sm font-medium text-white"
              >
                <Calendar className="mr-2" /> Tournament Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>
            <div class="mb-6">
              <label
                for="description"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Large input
              </label>
              <input
                type="text"
                placeholder="ex: The Grand Arena Tournament ..."
                id="description"
                class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            {/* Tournament Type Selection */}
            <div>
              <label className="flex items-center mb-2 text-sm font-medium text-white">
                <GamepadIcon className="mr-2" /> Tournament Type
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="real-sports"
                    checked={tournamentType === "real-sports"}
                    onChange={() => setTournamentType("real-sports")}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2">Real Sports</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="esports"
                    checked={tournamentType === "esports"}
                    onChange={() => setTournamentType("esports")}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2">Esports</span>
                </label>
              </div>
            </div>

            {/* Sport/Game Selection */}
            {tournamentType === "real-sports" && (
              <div>
                <label className="flex items-center mb-2 text-sm font-medium text-white">
                  <Flag className="mr-2" /> Select Sport
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <label
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                      sportType === "football"
                        ? "border-blue-500 bg-blue-900/50"
                        : "border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      value="football"
                      checked={sportType === "football"}
                      onChange={(e) => setSportType(e.target.value)}
                      className="hidden"
                    />
                    <Circle
                      className={`mx-auto mb-2 ${
                        sportType === "football"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                    Football
                  </label>
                  <label
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                      sportType === "volleyball"
                        ? "border-blue-500 bg-blue-900/50"
                        : "border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      value="volleyball"
                      checked={sportType === "volleyball"}
                      onChange={(e) => setSportType(e.target.value)}
                      className="hidden"
                    />
                    <Volleyball
                      className={`mx-auto mb-2 ${
                        sportType === "volleyball"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                    Volleyball
                  </label>
                  <label
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                      sportType === "basketball"
                        ? "border-blue-500 bg-blue-900/50"
                        : "border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      value="basketball"
                      checked={sportType === "basketball"}
                      onChange={(e) => setSportType(e.target.value)}
                      className="hidden"
                    />
                    <Circle
                      className={`mx-auto mb-2 ${
                        sportType === "basketball"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                    Basketball
                  </label>
                </div>
              </div>
            )}

            {/* Esport Game Input */}
            {tournamentType === "esports" && (
              <div>
                <label
                  htmlFor="esportGame"
                  className="flex items-center mb-2 text-sm font-medium text-white"
                >
                  <GamepadIcon className="mr-2" /> Esports Game
                </label>
                <input
                  type="text"
                  id="esportGame"
                  value={esportGame}
                  onChange={(e) => setEsportGame(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Enter game name (e.g., FIFA, PUBG)"
                  required
                />
              </div>
            )}

            {/* Number of Teams */}
            <div>
              <label
                htmlFor="numberOfTeams"
                className="flex items-center mb-2 text-sm font-medium text-white"
              >
                <Users className="mr-2" /> Number of Teams
              </label>
              <input
                type="number"
                id="numberOfTeams"
                value={numberOfTeams}
                onChange={(e) =>
                  setNumberOfTeams(
                    Math.max(2, Math.min(32, Number(e.target.value)))
                  )
                }
                min="2"
                max="32"
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>

            {/* Tournament Format */}
            <div>
              <label className="flex items-center mb-2 text-sm font-medium text-white">
                <Flag className="mr-2" /> Tournament Format
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="league"
                    checked={tournamentFormat === "league"}
                    onChange={() => setTournamentFormat("league")}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2">League</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="champions"
                    checked={tournamentFormat === "champions"}
                    onChange={() => setTournamentFormat("champions")}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2">Champions</span>
                </label>
              </div>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center mx-auto"
            >
              <Trophy className="mr-2" /> Create Tournament
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TournamentCreationForm;
