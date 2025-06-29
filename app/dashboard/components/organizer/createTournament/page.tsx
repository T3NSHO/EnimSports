//@ts-nocheck
"use client";
import { useSession } from "next-auth/react";

import React, { useState } from "react";

import { useRouter } from "next/navigation";
import delay from "@/lib/sleep";
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
import { useToast } from "@/hooks/use-toast";

const TournamentCreationForm = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
 
  const [tournamentTitle, setTournamentTitle] = useState("");
  const [tournamentPrize, setTournamentPrize] = useState("");
  const [startDate, setStartDate] = useState("");
  const [tournamentType, setTournamentType] = useState("");
  const [sportType, setSportType] = useState("");
  const [esportGame, setEsportGame] = useState("");
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [tournamentFormat, setTournamentFormat] = useState("");
  const [joinLink, setJoinLink] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>User is not authenticated. Please log in.</p>;
  }
  const tournament_organizer = session.user.id as string;

  // Handle form submission
  interface TournamentData {
    title: string;
    prize: string;
    startDate: string;
    type: string;
    sportDetails: string;
    numberOfTeams: number;
    format: string;
    tournament_organizer: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate form data
    const tournamentData: TournamentData = {
      title: tournamentTitle,
      prize: tournamentPrize,
      startDate,
      type: tournamentType,
      sportDetails: tournamentType === "real-sports" ? sportType : esportGame,
      numberOfTeams,
      format: tournamentFormat,
      tournament_organizer: tournament_organizer,
    };
    
    try {
      const response = await fetch("/api/register_tournament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tournamentData),
      });
      if (response.status === 201) {
        const data = await response.json();
        const tournamentId: string = data.tournamentId; // adjust if your API returns a different key
        const link = `${window.location.origin}/dashboard/tournament/join_tournament/${tournamentId}`;
        setJoinLink(link);
        toast({
          variant: "success",
          title: "Tournament created successfully",
          description: "You can now share the join link!",
        });
        // Optionally redirect after a delay
        // delay(1500);
        // router.push("/dashboard");
      }
    } catch (error) {
      console.error("Tournament creation error:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Tournament not created successfully : " + error,
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full flex flex-col items-center justify-center lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
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
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Large input
              </label>
              <input
                type="text"
                placeholder="ex: The Grand Arena Tournament ..."
                id="description"
                className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
          {joinLink && (
            <div className="mt-6 flex flex-col items-center">
              <div className="mb-2 text-green-400 font-semibold">Share this link to let others join:</div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={joinLink}
                  readOnly
                  className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 w-96"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(joinLink);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentCreationForm;
