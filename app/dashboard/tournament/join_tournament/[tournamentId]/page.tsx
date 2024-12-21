'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function JoinTeam({ params }: { params: Promise<{ tournamentId: string }> }) {
    const router = useRouter();
    const { tournamentId } = React.use(params); // Unwrapping params with React.use()
    const [status, setStatus] = useState('Processing...');

    useEffect(() => {
        if (tournamentId) {
            fetch(`/api/join-tournament/${tournamentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            )
                .then((res) => {
                    if (res.ok) {
                        setStatus('Success! You have joined the tournament.');
                        setTimeout(() => router.push('/dashboard'), 3000); // Redirect after 3 seconds
                    } else {
                        res.text().then((text) => setStatus(JSON.parse(text).error));   
                    }
                })
                .catch(() => {
                    setStatus('An error occurred. Please try again later.');
                });
        }
    }, [tournamentId, router]);

    return (
        <div>
            
            <p>{status}</p>
        </div>
    );
}
