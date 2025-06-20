"use client";

import { useState, useEffect, useRef } from "react";
import generateTournament from "@/lib/generate_matches";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useSession } from 'next-auth/react';

export default function TournamentsPage() {
  const { data: session, status } = useSession();
  const [tournaments, setTournaments] = useState({ ongoing: [], upcoming: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [openOngoing, setOpenOngoing] = useState<string | null>(null);
  const [openUpcoming, setOpenUpcoming] = useState<string | null>(null);
  const [showOngoing, setShowOngoing] = useState(true);
  const [teamNames, setTeamNames] = useState<{ [key: string]: string }>({});
  const processingRef = useRef(false);
  const [matchStatus, setMatchStatus] = useState<{ [key: string]: boolean }>({});

  // Fetch tournaments
  useEffect(() => {
    async function fetchTournaments() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/get_tournaments", {
          method: "POST",
        });
        const data = await response.json();

        const ongoing = data.filter((tournament: any) => tournament.status === "ongoing");
        const upcoming = data.filter((tournament: any) => tournament.status === "upcoming");

        setTournaments({ ongoing, upcoming });

        const allTeamIds = [
          ...new Set([
            ...ongoing.flatMap((t: any) => t.registered_teams),
            ...upcoming.flatMap((t: any) => t.registered_teams),
          ]),
        ];

        if (allTeamIds.length > 0) {
          const teamResponse = await fetch("/api/get_teams_name", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ team_ids: allTeamIds }),
          });
          const teamNamesData = await teamResponse.json();

          const teamNameMap = allTeamIds.reduce((acc, id, index) => {
            acc[id] = teamNamesData[index] || "Unknown Team";
            return acc;
          }, {} as { [key: string]: string });
          
          setTeamNames(teamNameMap);
        }

        // Fetch match status for each tournament
        const allTournaments = [...ongoing, ...upcoming];
        const matchStatusObj: { [key: string]: boolean } = {};
        await Promise.all(
          allTournaments.map(async (t: any) => {
            const res = await fetch(`/api/get_matches/${t._id}`, { method: 'POST' });
            const matchData = await res.json();
            matchStatusObj[t._id] = Array.isArray(matchData.matches) && matchData.matches.length > 0;
          })
        );
        setMatchStatus(matchStatusObj);
      } catch (error) {
        console.error("Error fetching tournaments or team names:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTournaments();
  }, []);
  
  // Process tournaments
  const getTeamNames = (teamIds: string[]) => {
    return teamIds.length > 0
      ? teamIds.map((id) => teamNames[id] || "Unknown Team").join(", ")
      : "No teams registered";
  };

  const handleGenerateBracket = async (tournamentId: string) => {
    try {
      const res = await fetch(`/api/generate_the_brackets/${tournamentId}`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to generate bracket');
      } else {
        alert('Bracket generated successfully!');
        // Refresh match status
        const matchRes = await fetch(`/api/get_matches/${tournamentId}`, { method: 'POST' });
        const matchData = await matchRes.json();
        setMatchStatus((prev) => ({ ...prev, [tournamentId]: Array.isArray(matchData.matches) && matchData.matches.length > 0 }));
      }
    } catch (err) {
      alert('Error generating bracket');
    }
  };

  if (isLoading) {
    return <p>Loading tournaments...</p>;
  }

  return (
    
    <div className="w-full h-full space-y-10">
      <div className="flex items-center justify-center mb-6">
        <button
          className={`px-6 py-2 mr-4 ${
            showOngoing ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
          } rounded-md`}
          onClick={() => setShowOngoing(true)}
        >
          Ongoing Tournaments
        </button>
        <button
          className={`px-6 py-2 ${
            !showOngoing ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
          } rounded-md`}
          onClick={() => setShowOngoing(false)}
        >
          Upcoming Tournaments
        </button>
      </div>

      {showOngoing ? (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Ongoing Tournaments</h2>
          <Table className="w-full">
            <TableCaption>List of ongoing tournaments</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Sport Type</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tournaments.ongoing.map((tournament: any) => (
                <TableRow key={tournament._id}>
                  <TableCell>{tournament.tournament_name}</TableCell>
                  <TableCell>{new Date(tournament.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{tournament.location}</TableCell>
                  <TableCell>{tournament.sport_type}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openOngoing === tournament._id}
                      onOpenChange={(open) =>
                        open ? setOpenOngoing(tournament._id) : setOpenOngoing(null)
                      }
                    >
                      <DialogTrigger asChild>
                        <span
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                          onClick={() => setOpenOngoing(tournament._id)}
                        >
                          Inspect
                        </span>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{tournament.tournament_name}</DialogTitle>
                          <DialogDescription>{`Format: ${tournament.tournament_format}`}</DialogDescription>
                          <p className="mt-2">
                            <strong>Teams:</strong> {getTeamNames(tournament.registered_teams)}
                          </p>
                          {/* Admin-only Generate Bracket button if not generated */}
                          {session?.user?.role === 'admin' && !matchStatus[tournament._id] && (
                            <button
                              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md w-full hover:bg-blue-700"
                              onClick={() => handleGenerateBracket(tournament._id)}
                            >
                              Generate Bracket
                            </button> 
                          )}
                          {/* Always show See Brackets button */}
                          <a href={`/dashboard/tournament/tournament_brackets/${tournament._id}`}>
                            <button className={`mt-4 px-6 py-2 w-full rounded-md ${matchStatus[tournament._id] ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-500 text-white'}`}>
                              See brackets
                            </button>
                          </a>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      ) : (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Tournaments</h2>
          <Table className="w-full">
            <TableCaption>List of upcoming tournaments</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Sport Type</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tournaments.upcoming.map((tournament: any) => (
                <TableRow key={tournament._id}>
                  <TableCell>{tournament.tournament_name}</TableCell>
                  <TableCell>{new Date(tournament.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{tournament.location}</TableCell>
                  <TableCell>{tournament.sport_type}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openUpcoming === tournament._id}
                      onOpenChange={(open) =>
                        open ? setOpenUpcoming(tournament._id) : setOpenUpcoming(null)
                      }
                    >
                      <DialogTrigger asChild>
                        <span
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                          onClick={() => setOpenUpcoming(tournament._id)}
                        >
                          Inspect
                        </span>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{tournament.tournament_name}</DialogTitle>
                          <DialogDescription>{`Format: ${tournament.tournament_format}`}</DialogDescription>
                          <p className="mt-2">
                            <strong>Teams:</strong> {getTeamNames(tournament.registered_teams)}
                          </p>
                          <a href={`/dashboard/tournament/join_tournament/${tournament._id}`}>
                            <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md w-full hover:bg-green-600">
                              Join Tournament
                            </button>
                          </a>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}
    </div>
  );
}
