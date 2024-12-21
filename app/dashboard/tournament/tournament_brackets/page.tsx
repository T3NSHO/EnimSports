"use client";

import React from "react";
import { SingleEliminationBracket, Match, SVGViewer } from "@g-loot/react-tournament-brackets";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import './brackets.css';

// Example matches data for 16 teams
const matches = [
  // Round 1
  {
    id: 1,
    name: "Round 1 - Match 1",
    nextMatchId: 9,
    tournamentRoundText: "Round 1",
    startTime: "2024-12-10",
    state: "DONE",
    participants: [
      { id: "p1", name: "Player 1", isWinner: true, status: "PLAYED", resultText: "WON" },
      { id: "p2", name: "Player 2", isWinner: false, status: "PLAYED", resultText: "LOST" },
    ],
  },
  {
    id: 2,
    name: "Round 1 - Match 2",
    nextMatchId: 9,
    tournamentRoundText: "Round 1",
    startTime: "2024-12-10",
    state: "DONE",
    participants: [
      { id: "p3", name: "Player 3", isWinner: false, status: "PLAYED", resultText: "LOST" },
      { id: "p4", name: "Player 4", isWinner: true, status: "PLAYED", resultText: "WON" },
    ],
  },
  {
    id: 3,
    name: "Round 1 - Match 3",
    nextMatchId: 10,
    tournamentRoundText: "Round 1",
    startTime: "2024-12-10",
    state: "DONE",
    participants: [
      { id: "p5", name: "Player 5", isWinner: true, status: "PLAYED", resultText: "WON" },
      { id: "p6", name: "Player 6", isWinner: false, status: "PLAYED", resultText: "LOST" },
    ],
  },
  {
    id: 4,
    name: "Round 1 - Match 4",
    nextMatchId: 10,
    tournamentRoundText: "Round 1",
    startTime: "2024-12-10",
    state: "DONE",
    participants: [
      { id: "p7", name: "Player 7", isWinner: false, status: "PLAYED", resultText: "LOST" },
      { id: "p8", name: "Player 8", isWinner: true, status: "PLAYED", resultText: "WON" },
    ],
  },
  {
    id: 5,
    name: "Round 1 - Match 5",
    nextMatchId: 11,
    tournamentRoundText: "Round 1",
    startTime: "2024-12-10",
    state: "DONE",
    participants: [
      { id: "p9", name: "Player 9", isWinner: true, status: "PLAYED", resultText: "WON" },
      { id: "p10", name: "Player 10", isWinner: false, status: "PLAYED", resultText: "LOST" },
    ],
  },
  {
    id: 6,
    name: "Round 1 - Match 6",
    nextMatchId: 11,
    tournamentRoundText: "Round 1",
    startTime: "2024-12-10",
    state: "DONE",
    participants: [
      { id: "p11", name: "Player 11", isWinner: false, status: "PLAYED", resultText: "LOST" },
      { id: "p12", name: "Player 12", isWinner: true, status: "PLAYED", resultText: "WON" },
    ],
  },
  {
    id: 7,
    name: "Round 1 - Match 7",
    nextMatchId: 12,
    tournamentRoundText: "Round 1",
    startTime: "2024-12-10",
    state: "DONE",
    participants: [
      { id: "p13", name: "Player 13", isWinner: true, status: "PLAYED", resultText: "WON" },
      { id: "p14", name: "Player 14", isWinner: false, status: "PLAYED", resultText: "LOST" },
    ],
  },
  {
    id: 8,
    name: "Round 1 - Match 8",
    nextMatchId: 12,
    tournamentRoundText: "Round 1",
    startTime: "2024-12-10",
    state: "DONE",
    participants: [
      { id: "p15", name: "Player 15", isWinner: false, status: "PLAYED", resultText: "LOST" },
      { id: "p16", name: "Player 16", isWinner: true, status: "PLAYED", resultText: "WON" },
    ],
  },
  // Quarter-Finals
  {
    id: 9,
    name: "Quarter-Final 1",
    nextMatchId: 13,
    tournamentRoundText: "Quarter-Final",
    startTime: "2024-12-11",
    state: "DONE",
    participants: [
      { id: "p1", name: "Player 1", isWinner: true, status: "PLAYED", resultText: "WON" },
      { id: "p4", name: "Player 4", isWinner: false, status: "PLAYED", resultText: "LOST" },
    ],
  },
  {
    id: 10,
    name: "Quarter-Final 2",
    nextMatchId: 13,
    tournamentRoundText: "Quarter-Final",
    startTime: "2024-12-11",
    state: "DONE",
    participants: [
      { id: "p5", name: "Player 5", isWinner: false, status: "PLAYED", resultText: "LOST" },
      { id: "p8", name: "Player 8", isWinner: true, status: "PLAYED", resultText: "WON" },
    ],
  },
  {
    id: 11,
    name: "Quarter-Final 3",
    nextMatchId: 14,
    tournamentRoundText: "Quarter-Final",
    startTime: "2024-12-11",
    state: "DONE",
    participants: [
      { id: "p9", name: "Player 9", isWinner: true, status: "PLAYED", resultText: "WON" },
      { id: "p12", name: "Player 12", isWinner: false, status: "PLAYED", resultText: "LOST" },
    ],
  },
  {
    id: 12,
    name: "Quarter-Final 4",
    nextMatchId: 14,
    tournamentRoundText: "Quarter-Final",
    startTime: "2024-12-11",
    state: "DONE",
    participants: [
      { id: "p13", name: "Player 13", isWinner: false, status: "PLAYED", resultText: "LOST" },
      { id: "p16", name: "Player 16", isWinner: true, status: "PLAYED", resultText: "WON" },
    ],
  },
  // Semi-Finals
  {
    id: 13,
    name: "Semi-Final 1",
    nextMatchId: 15,
    tournamentRoundText: "Semi-Final",
    startTime: "2024-12-12",
    state: "DONE",
    participants: [
      { id: "p1", name: "Player 1", isWinner: true, status: "PLAYED", resultText: "WON" },
      { id: "p8", name: "Player 8", isWinner: false, status: "PLAYED", resultText: "LOST" },
    ],
  },
  {
    id: 14,
    name: "Semi-Final 2",
    nextMatchId: 15,
    tournamentRoundText: "Semi-Final",
    startTime: "2024-12-12",
    state: "DONE",
    participants: [
      { id: "p9", name: "Player 9", isWinner: false, status: "PLAYED", resultText: "LOST" },
      { id: "p16", name: "Player 16", isWinner: true, status: "PLAYED", resultText: "WON" },
    ],
  },
  // Final
  {
    id: 15,
    name: "Final",
    nextMatchId: null,
    tournamentRoundText: "Final",
    startTime: "2024-12-13",
    state: "DONE",
    participants: [
      { id: "p1", name: "Player 1", isWinner: true, status: "PLAYED", resultText: "CHAMPION" },
      { id: "p16", name: "Player 16", isWinner: false, status: "PLAYED", resultText: "RUNNER-UP" },
    ],
  },
];

const TournamentBracket = () => {
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setClientReady(true); // Ensures this runs only on the client
  }, []);
  const size = useWindowSize();
  const { width, height } = size;
  const finalWidth = Math.max((width ?? 0) - 500, 500);
  
  return (
    <div style={{ padding: "20px", backgroundColor: "transparent" }}>
      <h1 style={{ color: "black" }}>Tournament Bracket</h1>
      <SingleEliminationBracket className="brackets"
        matches={matches}
        matchComponent={Match}
        svgWrapper={({ children, ...props }) => (
          <SVGViewer
          
            width={finalWidth}
            height={finalWidth}
            {...props}
            
          >
            {children}
          </SVGViewer>
        )}
      />
    </div>
  );
};

export default TournamentBracket;
