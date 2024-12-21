import mongoose from 'mongoose';
import { Match } from '@/app/models/match-model'; // Adjust path as needed

interface GenerateTournamentParams {
  teamIds: string[]; // Array of team IDs
  tournamentId: string; // ID of the tournament
  days: number; // Number of days in the tournament
  startDate: string; // Starting date in ISO format (e.g., "2024-12-12")
}

// Function to generate random matches
async function generateTournament({ teamIds, tournamentId, days, startDate }: GenerateTournamentParams) {
  if (teamIds.length < 2) {
    throw new Error('At least two teams are required to generate matches.');
  }

  // Shuffle teams for random matchups
  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Shuffle team IDs
  const shuffledTeams = shuffleArray([...teamIds]);

  // Calculate matches per day
  const totalMatches = Math.floor(shuffledTeams.length / 2);
  const matchesPerDay = Math.ceil(totalMatches / days);

  // Generate match data
  const matches = [];
  let matchId = 1;
  let currentDayIndex = 0;

  for (let i = 0; i < shuffledTeams.length - 1; i += 2) {
    const team1Id = shuffledTeams[i];
    const team2Id = shuffledTeams[i + 1];
    const matchDate = new Date(startDate);
    matchDate.setDate(matchDate.getDate() + currentDayIndex);

    // Create match object
    matches.push({
      id: matchId++,
      name: `Match ${matchId - 1}`,
      tournamentId: new mongoose.Types.ObjectId(tournamentId), // Link to tournament
      nextMatchId: null, // Placeholder for future rounds
      tournamentRoundText: `Round ${currentDayIndex + 1}`,
      startTime: matchDate.toISOString(),
      state: 'PENDING',
      team1Id: new mongoose.Types.ObjectId(team1Id),
      team2Id: new mongoose.Types.ObjectId(team2Id),
    });

    // Increment day index for new match day
    if (matches.length % matchesPerDay === 0) {
      currentDayIndex++;
    }
  }

  return matches;
}

export default generateTournament;