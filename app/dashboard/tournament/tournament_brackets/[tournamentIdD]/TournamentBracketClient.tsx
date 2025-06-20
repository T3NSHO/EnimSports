'use client';
import React, { useEffect, useState } from "react";
import { Bracket, Seed, SeedItem, SeedTeam, RoundProps, SeedProps } from "react-brackets";
import "../brackets.css";

interface TournamentBracketClientProps {
  tournamentIdD: string;
}

interface Participant {
  id: string;
  name: string;
  isWinner: boolean;
  status: string;
  resultText: string | null;
}

interface Match {
  id: number;
  name: string;
  nextMatchId: number | null;
  tournamentRoundText: string;
  startTime: string;
  state: string;
  participants: Participant[];
  [key: string]: any;
}

const renderCustomSeed = ({ seed, breakpoint, roundIndex, seedIndex }: SeedProps) => {
  // seed.teams is an array of { name: string }
  // We'll add score and highlight winner
  return (
    <Seed mobileBreakpoint={breakpoint}>
      <SeedItem>
        {seed.teams.map((team: any, idx: number) => (
          <SeedTeam
            key={team.name}
            style={{
              background: team.isWinner ? '#2563eb' : '#1e293b',
              color: team.isWinner ? '#fff' : '#cbd5e1',
              fontWeight: team.isWinner ? 'bold' : 'normal',
              border: team.isWinner ? '2px solid #2563eb' : '1px solid #334155',
              borderRadius: 6,
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 8px',
            }}
          >
            <span>{team.name}</span>
            {typeof team.score === 'number' && (
              <span style={{ marginLeft: 8, fontWeight: 'bold' }}>{team.score}</span>
            )}
          </SeedTeam>
        ))}
      </SeedItem>
    </Seed>
  );
};

const TournamentBracketClient: React.FC<TournamentBracketClientProps> = ({ tournamentIdD }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/get_matches/${tournamentIdD}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch matches");
        const data = await response.json();
        if (Array.isArray(data?.matches)) {
          setMatches(data.matches);
        } else {
          setMatches([]);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [tournamentIdD]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading tournament bracket...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!Array.isArray(matches) || matches.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">No matches available for this tournament.</div>
      </div>
    );
  }

  // Group matches by round
  const roundsMap: { [round: string]: any[] } = {};
  matches.forEach((match) => {
    const round = match.tournamentRoundText || "Round 1";
    if (!roundsMap[round]) roundsMap[round] = [];
    roundsMap[round].push(match);
  });

  // Convert to react-brackets format
  const rounds = Object.keys(roundsMap)
    .sort((a, b) => {
      // Sort rounds numerically if possible
      const aNum = parseInt(a.replace(/\D/g, ""), 10);
      const bNum = parseInt(b.replace(/\D/g, ""), 10);
      return aNum - bNum;
    })
    .map((roundName) => ({
      title: roundName,
      seeds: roundsMap[roundName].map((match) => ({
        id: match.id,
        date: match.startTime,
        teams: match.participants.map((p: any, idx: number) => ({
          name: p.name || "TBD",
          isWinner: !!p.isWinner,
          score: match[`team${idx + 1}Score`],
        })),
      })),
    }));

  return (
    <div className="p-5 bg-transparent">
      <h1 className="text-2xl font-bold mb-6 text-white text-center uppercase">
        Tournament Bracket
      </h1>
      <Bracket rounds={rounds} renderSeedComponent={renderCustomSeed} />
    </div>
  );
};

export default TournamentBracketClient;