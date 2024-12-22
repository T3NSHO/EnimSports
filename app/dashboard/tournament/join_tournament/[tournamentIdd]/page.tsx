'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function JoinTeam({ params }: { params: Promise<{ tournamentIdd: string }> }) {
    const router = useRouter();
    const { tournamentIdd } = React.use(params); // Unwrapping params with React.use()
    const [status, setStatus] = useState('Processing...');

    useEffect(() => {
        if (tournamentIdd) {
            fetch(`/api/join-tournament/${tournamentIdd}`, {
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
    }, [tournamentIdd, router]);

    return (
        <div>
            
            <p>{status}</p>
        </div>
    );
}
