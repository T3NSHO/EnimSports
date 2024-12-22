import mongoose from 'mongoose';
import { Match } from '@/app/models/match-model'; // Adjust the path as needed
import dbconnect from './db_connect';

// Tournament interface
interface Tournament {
  registered_teams: string[]; // Array of team IDs
  _id: string; // ID of the tournament
  start_date: string; // Starting date in ISO format (e.g., "2024-12-10")
  end_date: string; // Ending date in ISO format (e.g., "2024-12-12")
}

async function generateTournamentFromObject(tournament: Tournament) {
  const { registered_teams: teamIds, _id: tournamentId, start_date, end_date } = tournament;

  if (teamIds.length < 2) {
    throw new Error('At least two teams are required to generate matches.');
  }
  console.log('Match model defined:', mongoose.models.Match);


  // Calculate the number of days between the start and end date
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  if (days < 1) {
    throw new Error('Invalid tournament duration: Start date must be before or the same as the end date.');
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

  // Generate and save match data
  const matches = [];
  let matchId = 1;
  let currentDayIndex = 0;

  for (let i = 0; i < shuffledTeams.length - 1; i += 2) {
    const team1Id = shuffledTeams[i];
    const team2Id = shuffledTeams[i + 1];
    const matchDate = new Date(start_date);
    matchDate.setDate(matchDate.getDate() + currentDayIndex);
    console.log('Match object created:', matchDate);
    // Create match object
    const match = new Match({
      id: matchId,
      name: `Match ${matchId}`,
      tournamentId: new mongoose.Types.ObjectId(tournamentId), // Link to tournament
      nextMatchId: null, // Placeholder for future rounds
      tournamentRoundText: `Round ${currentDayIndex + 1}`,
      startTime: matchDate.toISOString(),
      state: 'PENDING',
      team1Id: new mongoose.Types.ObjectId(team1Id),
      team2Id: new mongoose.Types.ObjectId(team2Id),
    });

    console.log('Match object created:', match);
    await dbconnect(); // Connect to MongoDB
    // Save match to MongoDB
    await match.save();

    // Add to matches array for reference
    matches.push(match);

    matchId++;

    // Increment day index for new match day
    if (matches.length % matchesPerDay === 0) {
      currentDayIndex++;
    }
  }

  return matches;
}

export default generateTournamentFromObject;
