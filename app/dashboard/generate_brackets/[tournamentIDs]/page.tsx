// page.tsx


interface PageProps {
  params: {
    tournamentIDs: string;
  };
}

export async function Page({ params }: PageProps) {
  return <JoinTeam tournamentID={params.tournamentIDs} />;
}

// JoinTeam.tsx
'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface JoinTeamProps {
  tournamentID: string;
}

const JoinTeam = ({ tournamentID }: JoinTeamProps) => {
  const router = useRouter();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    if (tournamentID) {
      fetch(`/api/generate_the_brackets/${tournamentID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.ok) {
            setStatus('Success! You have created the brackets.');
            setTimeout(() => router.push('/dashboard'), 3000);
          } else {
            res.text().then((text) => setStatus(JSON.parse(text).error));
          }
        })
        .catch(() => {
          setStatus('An error occurred. Please try again later.');
        });
    }
  }, [tournamentID, router]);

  return (
    <div>
      <p>{status}</p>
    </div>
  );
}

export default JoinTeam;