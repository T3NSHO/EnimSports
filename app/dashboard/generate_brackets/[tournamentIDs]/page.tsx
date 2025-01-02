// page.tsx
import JoinTeam from '@/app/dashboard/generate_brackets/[tournamentIDs]/jointeam';

interface PageProps {
  params: {
    tournamentIDs: string;
  };
}

export default async function Page({ params }: PageProps) {
  return <JoinTeam tournamentID={params.tournamentIDs} />;
}

