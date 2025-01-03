import JoinTeam from './JoinTeam';

export default async function Page({ params }: { params: Promise<{ tournamentIdd: string }> }) {
    const resolvedParams = await params; // Resolve the params promise
    return <JoinTeam params={resolvedParams} />;
}
