import JoinTeam from '@/app/dashboard/generate_brackets/[tournamentIDs]/jointeam';

export default async function Page({
    params,
  }: {
    params: { tournamentIDs: string };
  }) {
    return <JoinTeam tournamentID={params.tournamentIDs} />;
  }
  