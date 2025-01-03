//@ts-nocheck
"use client";


import React from "react";
import { FormEvent } from "react";
import {useRouter} from "next/navigation";
import delay from "@/lib/sleep";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

const page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>User is not authenticated. Please log in.</p>;
  }
  const team_leader = (session?.user as { id: string }).id;

  async function Register_team(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const team_name = formData.get("team_name") as string;
    const description = formData.get("description") as string;
    const school = formData.get("school") as string;
    const team_count = formData.get("team_count") as string;

    const response = await fetch("/api/register_teams", {
      method: "POST",
      body: JSON.stringify({
        team_name,
        school,
        team_count,
        description,
        team_leader,
      }),
    });
    if (response.status === 201) {
      toast({
        variant: "success",
        title: "Team created successfully",
        description: "You will redirect to the Dashboard page",
      });
      delay(1500);
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Team not created succesfully retry again please",
      });
    }
  }

  return (
    <form onSubmit={Register_team} className="w-3/5 mx-auto mt-24">
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Team Name
        </label>
        <input
          name="team_name"
          type="text"
          id="team-name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter team name"
          required
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          School
        </label>
        <input
          type="text"
          name="school"
          id="school"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter school name"
          required
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Team Description
        </label>
        <textarea
          id="team-description"
          name="description"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Provide a brief description of your team"
          rows={3}
        ></textarea>
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Number of Team Members
        </label>
        <input
          type="number"
          id="team-members"
          name="team_count"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter number of team members"
          required
        />
      </div>
      <div className="flex items-start mb-5">
        <div className="flex items-center h-5">
          <input
            id="accept-terms"
            type="checkbox"
            value=""
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
            required
          />
        </div>
        <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          I confirm that I am the team leader
        </label>
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Register Team
      </button>
    </form>
  );
};

export default page;
