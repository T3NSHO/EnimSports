import TournamentBracketClient from './TournamentBracketClient';

export default async function Page({ params }: { params: Promise<{ tournamentIdD: string }> }) {
  const resolvedParams = await params;
  return <TournamentBracketClient tournamentIdD={resolvedParams.tournamentIdD} />;
}