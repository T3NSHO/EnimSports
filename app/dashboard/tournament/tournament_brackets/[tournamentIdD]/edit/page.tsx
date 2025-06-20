import BracketEditClient from './BracketEditClient';

export default async function Page({ params }: { params: { tournamentIdD: string } }) {
  return <BracketEditClient tournamentIdD={params.tournamentIdD} />;
}
