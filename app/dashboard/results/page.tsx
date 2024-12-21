"use client"

import React, { useState } from 'react';
import './results.css';

const MatchResults = () => {
  const matches = [
    { id: 1, team1: 'Team A', score: '3 - 1', team2: 'Team B', winner: 'Team A', date: 'Nov 20, 2024', tournament: 'Champions League' },
    { id: 2, team1: 'Team C', score: '0 - 2', team2: 'Team D', winner: 'Team D', date: 'Nov 21, 2024', tournament: 'Europa League' },
    { id: 3, team1: 'Team E', score: '1 - 1', team2: 'Team F', winner: null, date: 'Nov 22, 2024', tournament: 'Premier League' },
    { id: 4, team1: 'Team G', score: '4 - 0', team2: 'Team H', winner: 'Team G', date: 'Nov 23, 2024', tournament: 'World Cup' },
    { id: 5, team1: 'Team I', score: '2 - 2', team2: 'Team J', winner: null, date: 'Nov 24, 2024', tournament: 'Friendly Match' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTournament, setFilterTournament] = useState('');

  const filteredMatches = matches.filter((match) => {
    const matchesSearch = 
      match.team1.toLowerCase().includes(searchTerm.toLowerCase()) || 
      match.team2.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTournament ? match.tournament === filterTournament : true;
    return matchesSearch && matchesFilter;
  });

  const tournaments = [...new Set(matches.map((match) => match.tournament))];

  return (
    <div className="table-container">
      {/* Search and Filter Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search by team..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterTournament}
          onChange={(e) => setFilterTournament(e.target.value)}
          className="filter-select"
        >
          <option value="">All Tournaments</option>
          {tournaments.map((tournament, index) => (
            <option key={index} value={tournament}>
              {tournament}
            </option>
          ))}
        </select>
      </div>

      {/* Match Table */}
      <table className="custom-table">
        <thead>
          <tr>
            <th>Match</th>
            <th>Team 1</th>
            <th>Score</th>
            <th>Team 2</th>
            <th>Date</th>
            <th>Tournament</th>
          </tr>
        </thead>
        <tbody>
          {filteredMatches.map((match) => (
            <tr key={match.id}>
              <td>Match {match.id}</td>
              <td className={match.winner === match.team1 ? 'winner' : ''}>{match.team1}</td>
              <td>{match.score}</td>
              <td className={match.winner === match.team2 ? 'winner' : ''}>{match.team2}</td>
              <td>{match.date}</td>
              <td>{match.tournament}</td>
            </tr>
          ))}
          {filteredMatches.length === 0 && (
            <tr>
              <td colSpan={6}>No matches found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MatchResults;
