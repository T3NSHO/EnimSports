'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function JoinTeam({ params }: { params: Promise<{ teamId: string }> }) {
    const router = useRouter();
    const { teamId } = React.use(params); // Unwrapping params with React.use()
    const [status, setStatus] = useState('Processing...');

    useEffect(() => {
        if (teamId) {
            fetch(`/api/join-team/${teamId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            )
                .then((res) => {
                    if (res.ok) {
                        setStatus('Success! You have joined the team.');
                        setTimeout(() => router.push('/dashboard'), 3000); // Redirect after 3 seconds
                    } else {
                        res.text().then((text) => setStatus(JSON.parse(text).error));   
                    }
                })
                .catch(() => {
                    setStatus('An error occurred. Please try again later.');
                });
        }
    }, [teamId, router]);

    return (
        <div>
            
            <p>{status}</p>
        </div>
    );
}
