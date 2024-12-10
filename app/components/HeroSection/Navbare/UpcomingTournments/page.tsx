"use client";

import React, { useState, useRef, useEffect } from "react";

export default function TournamentTable() {
  // Sample data for the table
  const tournaments = [
    {
      id: 1,
      type: "esports",
      name: "World Cup 2024",
      game: "Final",
      prize: "500,000$",
      date: "12.01.24",
      description:
        "The grand final of the World Cup 2024, featuring the top players of the year.",
      detailedDescription:
        "Join us for the World Cup 2024 Final, where the top esports teams battle for the ultimate glory and a prize pool of $500,000. Witness the most skilled players go head-to-head in an unforgettable showdown.",
    },
    {
      id: 2,
      type: "esports",
      name: "Champion's Clash",
      game: "Quarter-Final",
      prize: "100,000$",
      date: "11.25.24",
      description:
        "The intense quarter-final of the Champion's Clash, featuring rising stars.",
      detailedDescription:
        "The Champion's Clash quarter-final features top-tier competition as the rising stars of esports take the stage. With a prize pool of $100,000, this is a battle you won't want to miss.",
    },
    {
      id: 3,
      type: "esports",
      name: "Mega Showdown",
      game: "Semi-Final",
      prize: "250,000$",
      date: "11.20.24",
      description: "The semi-final battle of the Mega Showdown tournament.",
      detailedDescription:
        "The Mega Showdown semi-finals bring together the best competitors of the season for a $250,000 prize pool. Who will make it to the final round? Tune in for the most intense action.",
    },
    {
      id: 4,
      type: "sports",
      name: "Grand Arena Tournament",
      game: "Final",
      prize: "1,000,000$",
      date: "12.10.24",
      description:
        "The ultimate sports showdown for the Grand Arena Tournament Final.",
      detailedDescription:
        "The Grand Arena Tournament Final is set to offer breathtaking moments as top athletes compete for a grand prize of $1,000,000. Don't miss the chance to watch history being made.",
    },
    {
      id: 5,
      type: "esports",
      name: "Ultimate Brawl",
      game: "Preliminary",
      prize: "50,000$",
      date: "11.15.24",
      description: "The preliminary rounds of the Ultimate Brawl tournament.",
      detailedDescription:
        "Kick off the Ultimate Brawl tournament with the preliminary rounds. While the stakes are lower, the competition is fierce as teams battle for a spot in the main tournament with a $50,000 prize.",
    },
  ];

  // State for handling the list and search/sort query
  const [filteredTournaments, setFilteredTournaments] = useState(tournaments);
  const [isVisible, setIsVisible] = useState(false);
  const [tournamentId, setTournamentId] = useState(1);
  const divRef = useRef(null);

  // Function to handle sorting or searching
  const handleSortOrSearch = (query) => {
    if (["date", "name", "game", "type", "prize"].includes(query)) {
      const sortedList = [...tournaments].sort((a, b) =>
        a[query].localeCompare(b[query])
      );
      setFilteredTournaments(sortedList);
    } else {
      const filteredList = tournaments.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.game.toLowerCase().includes(query.toLowerCase()) ||
          item.prize.includes(query) ||
          item.date.includes(query) ||
          item.type.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTournaments(filteredList);
    }
  };

  // Function to handle inspect
  const handleInspect = (id) => {
    setIsVisible(!isVisible);
    setTournamentId(id - 1);
  };

  // Function to handleHideCard
  const handleHideCard = (e) => {
    if (divRef.current && !divRef.current.contains(e.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleHideCard);

    return () => {
      document.removeEventListener("mousedown", handleHideCard);
    };
  }, []);

  return (
    <>
      {/* Modal/Inspection View */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 ${
          isVisible ? "flex" : "hidden"
        } items-center justify-center p-4`}
      >
        <div
          ref={divRef}
          className="max-w-4xl w-full rounded-lg overflow-hidden shadow-lg bg-gray-800 hover:shadow-2xl transition-shadow duration-300 ease-in-out"
        >
          <img
            className="w-full h-48 md:h-64 object-cover"
            src="/foot.jpg"
            alt={`${tournaments[tournamentId].name} cover`}
          />
          <div className="p-4 md:p-8">
            <div className="font-semibold text-xl md:text-2xl text-white">
              {tournaments[tournamentId].name}
            </div>
            <p className="text-gray-400 text-sm mb-2">
              {tournaments[tournamentId].type} |{" "}
              {tournaments[tournamentId].game}
            </p>
            <p className="text-gray-300 text-sm md:text-base mb-4">
              {tournaments[tournamentId].description}
            </p>

            <div className="text-gray-200 text-sm mb-6">
              <strong>Description:</strong>
              <p className="mt-2 text-gray-300 text-sm md:text-base">
                {tournaments[tournamentId].detailedDescription}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-indigo-400 text-base md:text-lg font-semibold">
                {tournaments[tournamentId].prize}
              </span>
              <span className="text-gray-500 text-sm">
                {tournaments[tournamentId].date}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-8 lg:px-40 pt-10 md:pt-20 text-white min-h-screen">
        {/* Search and Sort Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-4 space-y-4 md:space-y-0">
          <input
            id="searchZone"
            type="text"
            onChange={(e) => handleSortOrSearch(e.target.value)}
            placeholder="Search tournament by name"
            className="px-4 py-2 placeholder:italic placeholder:text-slate-400 bg-gray-800 text-white rounded w-full md:max-w-sm"
          />
          <select
            className="px-4 py-2 bg-gray-800 text-white rounded md:ml-4 w-full md:w-auto"
            onChange={(e) => handleSortOrSearch(e.target.value)}
          >
            <option value="">Select Sort Option</option>
            <option value="date">Sort by: Event Date</option>
            <option value="name">Sort by: Event Name</option>
            <option value="game">Sort by: Event Game</option>
            <option value="type">Sort by: Event Type</option>
            <option value="prize">Sort by: Event Prize Pool</option>
          </select>
        </div>

        {/* Tournament Table/Cards */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {/* Table Headers - Hidden on Mobile */}
          <div className="hidden md:grid md:grid-cols-6 p-4 font-semibold text-gray-400 border-b border-gray-700">
            <div>Name</div>
            <div>Game</div>
            <div>Type</div>
            <div>Prize Pool</div>
            <div>Event Date</div>
            <div>Inspect</div>
          </div>

          {/* Mobile and Desktop Views */}
          {filteredTournaments.map((tournament, index) => (
            <div
              key={tournament.id}
              className={`${
                index % 2 === 0 ? "bg-slate-900" : "bg-slate-800"
              } hover:bg-slate-950 transition border-b border-gray-700`}
            >
              {/* Mobile View - Card Layout */}
              <div className="md:hidden p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="font-semibold">{tournament.name}</div>
                  <div className="text-indigo-400">{tournament.prize}</div>
                </div>
                <div className="text-sm text-gray-400">
                  {tournament.game} | {tournament.type}
                </div>
                <div className="text-sm text-gray-500">{tournament.date}</div>
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => handleInspect(tournament.id)}
                    className="bg-gray-700 px-4 py-1 rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 flex-1"
                  >
                    Inspect
                  </button>
                </div>
              </div>

              {/* Desktop View - Grid Layout */}
              <div className="hidden md:grid md:grid-cols-6 p-4">
                <div>{tournament.name}</div>
                <div>{tournament.game}</div>
                <div>{tournament.type}</div>
                <div>{tournament.prize}</div>
                <div>{tournament.date}</div>
                <div>
                  <button
                    onClick={() => handleInspect(tournament.id)}
                    className="bg-gray-700 px-4 rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
