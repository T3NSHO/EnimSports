//@ts-nocheck
"use client";

import { useSession } from "next-auth/react";
import React, { FormEvent, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import delay from "@/lib/sleep";

const EditTournamentPage = ({ params }: { params: { tournamentId: string } }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    if (params.tournamentId) {
      fetch(`/api/get_tournament/${params.tournamentId}`)
        .then(res => res.json())
        .then(data => setTournament(data));
    }
  }, [params.tournamentId]);

  if (status === "loading" || !tournament) {
    return <p>Loading...</p>;
  }

  if (!session || session.user.role !== 'admin') {
    return <p>You are not authorized to view this page.</p>;
  }

  async function updateTournament(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const tournament_name = formData.get("tournament_name") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;
    const max_teams = formData.get("max_teams") as string;
    const tournament_type = formData.get("tournament_type") as string;
    const status = formData.get("status") as string;

    const response = await fetch(`/api/update_tournament/${params.tournamentId}`, {
      method: "PUT",
      body: JSON.stringify({
        tournament_name,
        location,
        start_date,
        end_date,
        max_teams,
        tournament_type,
        description,
        status,
      }),
    });
    
    if (response.ok) {
      toast({
        variant: "success",
        title: "Tournament updated successfully",
        description: "You will be redirected to the Dashboard page",
      });
      await delay(1500);
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Tournament not updated successfully. Please retry.",
      });
    }
  }

  return (
    <form onSubmit={updateTournament} className="max-w-sm mx-auto mt-8">
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Tournament Name
        </label>
        <input
          name="tournament_name"
          type="text"
          id="tournament-name"
          defaultValue={tournament.tournament_name}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter tournament name"
          required
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Location
        </label>
        <input
          type="text"
          name="location"
          id="location"
          defaultValue={tournament.location}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter tournament location"
          required
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Tournament Description
        </label>
        <textarea
          id="tournament-description"
          name="description"
          defaultValue={tournament.description}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Provide a brief description of the tournament"
          rows={3}
        ></textarea>
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Tournament Type
        </label>
        <select
          name="tournament_type"
          id="tournament-type"
          defaultValue={tournament.tournament_type}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        >
          <option value="single-elimination">Single Elimination</option>
          <option value="double-elimination">Double Elimination</option>
          <option value="round-robin">Round Robin</option>
          <option value="group-stage">Group Stage</option>
        </select>
      </div>
       <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Status
        </label>
        <select
          name="status"
          id="status"
          defaultValue={tournament.status}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        >
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Maximum Number of Teams
        </label>
        <input
          type="number"
          id="max-teams"
          name="max_teams"
          defaultValue={tournament.max_teams}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter maximum number of teams"
          required
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Start Date
        </label>
        <input
          type="date"
          id="start-date"
          name="start_date"
          defaultValue={new Date(tournament.start_date).toISOString().split('T')[0]}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          End Date
        </label>
        <input
          type="date"
          id="end-date"
          name="end_date"
          defaultValue={new Date(tournament.end_date).toISOString().split('T')[0]}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Update Tournament
      </button>
    </form>
  );
};

export default EditTournamentPage; 