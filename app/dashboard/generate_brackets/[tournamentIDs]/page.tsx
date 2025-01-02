'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface JoinTeamProps {
  params: {
    tournamentIDs: string;
  };
}

export default function JoinTeam({ params }: JoinTeamProps) {
  const router = useRouter();
  const { tournamentIDs } = params; // Destructure `params` correctly
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    if (tournamentIDs) {
      fetch(`/api/generate_the_brackets/${tournamentIDs}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.ok) {
            setStatus('Success! You have created the brackets.');
            setTimeout(() => router.push('/dashboard'), 3000); // Redirect after 3 seconds
          } else {
            res.text().then((text) => setStatus(JSON.parse(text).error));
          }
        })
        .catch(() => {
          setStatus('An error occurred. Please try again later.');
        });
    }
  }, [tournamentIDs, router]);

  return (
    <div>
      <p>{status}</p>
    </div>
  );
}
