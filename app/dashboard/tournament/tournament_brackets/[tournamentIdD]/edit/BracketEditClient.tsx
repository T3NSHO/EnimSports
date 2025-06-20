'use client';
import React, { useEffect, useState } from "react";

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

interface Props {
  tournamentIdD: string;
}

const BracketEditClient: React.FC<Props> = ({ tournamentIdD }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
        setMatches(Array.isArray(data?.matches) ? data.matches : []);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [tournamentIdD]);

  const handleWinnerChange = (matchId: number, winnerIndex: number) => {
    setMatches((prev) =>
      prev.map((match) =>
        match.id === matchId
          ? {
              ...match,
              participants: match.participants.map((p, idx) => ({
                ...p,
                isWinner: idx === winnerIndex,
                resultText: idx === winnerIndex ? "WON" : "LOST",
                status: match.state === "PLAYED" ? "PLAYED" : p.status,
              })),
            }
          : match
      )
    );
  };

  const handleScoreChange = (matchId: number, teamIndex: number, value: string) => {
    setMatches((prev) =>
      prev.map((match) =>
        match.id === matchId
          ? {
              ...match,
              [`team${teamIndex + 1}Score`]: value === '' ? null : Number(value),
            }
          : match
      )
    );
  };

  const handleStateChange = (matchId: number, newState: string) => {
    setMatches((prev) =>
      prev.map((match) =>
        match.id === matchId
          ? { ...match, state: newState }
          : match
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/update_matches/${tournamentIdD}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matches }),
      });
      if (!response.ok) throw new Error("Failed to update matches");
      alert("Bracket updated!");
    } catch (err: any) {
      alert(err.message || "Error saving results");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading matches...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Bracket Results</h1>
      {matches.map((match) => (
        <div key={match.id} className="mb-4 p-4 bg-gray-800 rounded">
          <div className="mb-2 font-semibold">{match.name} ({match.tournamentRoundText})</div>
          <div className="flex gap-4 mb-2">
            {match.participants.map((p, idx) => (
              <label key={p.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`winner-${match.id}`}
                  checked={p.isWinner}
                  onChange={() => handleWinnerChange(match.id, idx)}
                />
                <span>{p.name}</span>
                <input
                  type="number"
                  className="ml-2 w-16 px-1 py-0.5 rounded bg-gray-700 border border-gray-600 text-white"
                  placeholder="Score"
                  value={match[`team${idx + 1}Score`] ?? ''}
                  onChange={e => handleScoreChange(match.id, idx, e.target.value)}
                />
              </label>
            ))}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm">State:</label>
            <select
              value={match.state || 'PENDING'}
              onChange={e => handleStateChange(match.id, e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
            >
              <option value="PENDING">PENDING</option>
              <option value="PLAYED">PLAYED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
        </div>
      ))}
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {saving ? "Saving..." : "Save Results"}
      </button>
    </div>
  );
};

export default BracketEditClient;
