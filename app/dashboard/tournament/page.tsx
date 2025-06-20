//@ts-nocheck
'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const TournamentListPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState('');

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/get_tournaments', { method: 'POST' });
        const data = await res.json();
        if (!Array.isArray(data.tournaments)) throw new Error('Invalid data');
        // For each tournament, check if matches exist
        const tournamentsWithMatchStatus = await Promise.all(
          data.tournaments.map(async (tournament) => {
            const matchRes = await fetch(`/api/get_matches/${tournament._id}`, { method: 'POST' });
            const matchData = await matchRes.json();
            return {
              ...tournament,
              matchesGenerated: Array.isArray(matchData.matches) && matchData.matches.length > 0,
            };
          })
        );
        setTournaments(tournamentsWithMatchStatus);
      } catch (err) {
        setError(err.message || 'Failed to fetch tournaments');
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, [generating]);

  const handleGenerateBracket = async (tournamentId) => {
    setGenerating(tournamentId);
    try {
      const res = await fetch(`/api/generate_the_brackets/${tournamentId}`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to generate bracket');
      } else {
        alert('Bracket generated successfully!');
      }
    } catch (err) {
      alert('Error generating bracket');
    } finally {
      setGenerating('');
    }
  };

  if (status === 'loading' || loading) return <div>Loading tournaments...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!session) return <div>Please log in to view tournaments.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tournaments</h1>
      <div className="space-y-4">
        {tournaments.map((tournament) => (
          <div key={tournament._id} className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold text-white">{tournament.tournament_name}</div>
              <div className="text-gray-400 text-sm">{tournament.location} | {tournament.start_date} - {tournament.end_date}</div>
              <div className="text-gray-400 text-sm">Type: {tournament.tournament_type}</div>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              {session.user.role === 'admin' && !tournament.matchesGenerated && (
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  onClick={() => handleGenerateBracket(tournament._id)}
                  disabled={generating === tournament._id}
                >
                  {generating === tournament._id ? 'Generating...' : 'Generate Bracket'}
                </button>
              )}
              <button
                className={`px-4 py-2 rounded transition text-white ${tournament.matchesGenerated ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                onClick={() => router.push(`/dashboard/tournament/tournament_brackets/${tournament._id}`)}
              >
                View Bracket
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentListPage;
