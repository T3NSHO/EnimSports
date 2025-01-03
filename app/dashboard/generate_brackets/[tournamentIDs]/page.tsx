import JoinTeam from '@/app/dashboard/generate_brackets/[tournamentIDs]/jointeam';

interface PageProps {
  params: Promise<{
    tournamentIDs: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  // Await the resolution of params if it's a promise
  const resolvedParams = await params;

  // Destructure the tournamentIDs after resolution
  const { tournamentIDs } = resolvedParams;

  return <JoinTeam tournamentID={tournamentIDs} />;
}
