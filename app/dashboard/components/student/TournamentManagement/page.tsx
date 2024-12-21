"use client";

import { useState, useEffect } from "react";
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

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState({ ongoing: [], upcoming: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [openOngoing, setOpenOngoing] = useState<string | null>(null);
  const [openUpcoming, setOpenUpcoming] = useState<string | null>(null);
  const [showOngoing, setShowOngoing] = useState(true);
  const [teamNames, setTeamNames] = useState<{ [key: string]: string[] }>({});

  // Fetch tournaments
  useEffect(() => {
    async function fetchTournaments() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/get_tournaments", {
          method: "POST",
        });
        const data = await response.json();

        // Separate ongoing and upcoming tournaments
        const ongoing = data.filter((tournament: any) => tournament.status === "ongoing");
        const upcoming = data.filter((tournament: any) => tournament.status === "upcoming");

        setTournaments({ ongoing, upcoming });

        // Combine all unique team IDs from both ongoing and upcoming tournaments
        const allTeamIds = [
          ...new Set([
            ...ongoing.flatMap((t: any) => t.registered_teams),
            ...upcoming.flatMap((t: any) => t.registered_teams)
          ])
        ];

        // Fetch team names if there are team IDs
        if (allTeamIds.length > 0) {
          const teamResponse = await fetch("/api/get_teams_name", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ team_ids: allTeamIds }),
          });
          const teamNamesData = await teamResponse.json();

          // Create a mapping of team ID to team name
          const teamNameMap = allTeamIds.reduce((acc, id, index) => {
            acc[id] = teamNamesData[index] || "Unknown Team";
            return acc;
          }, {} as { [key: string]: string });

          setTeamNames(teamNameMap);
        }
      } catch (error) {
        console.error("Error fetching tournaments or team names:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTournaments();
  }, []);

  const handleOngoingInspect = (id: string) => {
    setOpenOngoing(id);
  };

  const handleUpcomingInspect = (id: string) => {
    setOpenUpcoming(id);
  };

  if (isLoading) {
    return <p>Loading tournaments...</p>;
  }

  // Helper function to convert team IDs to names
  const getTeamNames = (teamIds: string[]) => {
    return teamIds.length > 0 
      ? teamIds.map(id => teamNames[id] || "Unknown Team").join(", ")
      : "No teams registered";
  };
  console.log(generateTournament(tournaments.ongoing[0].registered_teams));
  return (
    <div className="w-full h-full space-y-10">
      {/* Toggle between Ongoing and Upcoming tournaments */}
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

      {/* Display Ongoing or Upcoming Tournaments based on the toggle */}
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
                          onClick={() => handleOngoingInspect(tournament._id)}
                        >
                          Inspect
                        </span>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{tournament.tournament_name}</DialogTitle>
                          <DialogDescription>{`Format: ${tournament.tournament_format}`}</DialogDescription>
                          <p className="mt-2">
                            <strong>Teams:</strong>{" "}
                            {getTeamNames(tournament.registered_teams)}
                          </p>
                          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md w-full hover:bg-blue-600" >
                            See brackets
                          </button>
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
                          onClick={() => handleUpcomingInspect(tournament._id)}
                        >
                          Inspect
                        </span>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{tournament.tournament_name}</DialogTitle>
                          <DialogDescription>{`Format: ${tournament.tournament_format}`}</DialogDescription>
                          <p className="mt-2">
                            <strong>Teams:</strong>{" "}
                            {getTeamNames(tournament.registered_teams)}
                          </p>
                          <a href={`/dashboard/tournament/join_tournament/${tournament._id}`} >
                          <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md w-full hover:bg-green-600" >
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