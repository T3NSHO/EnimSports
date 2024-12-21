import mongoose, { Schema, Document } from 'mongoose';
import { teamModel } from '@/app/models/team-model'; // Adjust path as needed

// Interface for Match Document
export interface IMatch extends Document {
  id: number;
  name: string;
  tournamentId: mongoose.Types.ObjectId; // Tournament ID
  nextMatchId: number | null; // Reference to the next match, if applicable
  tournamentRoundText: string;
  startTime: string; // ISO date string
  state: string;
  team1Id: mongoose.Types.ObjectId; // Team 1 ID
  team2Id: mongoose.Types.ObjectId; // Team 2 ID
  team1Name?: string; // Automatically populated
  team2Name?: string; // Automatically populated
  team1Score?: number; // Optional, defaults to null
  team2Score?: number; // Optional, defaults to null
  winner?: string; // Calculated winner based on scores
}

// Match Schema
const MatchSchema = new Schema<IMatch>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true }, // Reference to Tournament
  nextMatchId: { type: Number, default: null }, // Optional for linking to the next match
  tournamentRoundText: { type: String, required: true },
  startTime: { type: String, required: true }, // ISO date
  state: { type: String, required: true },
  team1Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Teams', required: true },
  team2Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Teams', required: true },
  team1Name: { type: String },
  team2Name: { type: String },
  team1Score: { type: Number, default: null },
  team2Score: { type: Number, default: null },
  winner: { type: String },
});

// Middleware to fetch team names and calculate winner
MatchSchema.pre('save', async function (next) {
  const match = this as IMatch;

  // Fetch Team Names
  if (!match.team1Name) {
    const team1 = await teamModel.findById(match.team1Id);
    if (team1) match.team1Name = team1.team_name;
  }
  if (!match.team2Name) {
    const team2 = await teamModel.findById(match.team2Id);
    if (team2) match.team2Name = team2.team_name;
  }

  // Calculate Winner (if scores are provided)
  if (match.team1Score != null && match.team2Score != null) {
    if (match.team1Score > match.team2Score) {
      match.winner = match.team1Name || 'Team 1';
    } else if (match.team1Score < match.team2Score) {
      match.winner = match.team2Name || 'Team 2';
    } else {
      match.winner = 'Draw';
    }
  } else {
    match.winner = undefined; // Reset winner if scores are not available
  }

  next();
});

// Export Match Model
export const Match = mongoose.model<IMatch>('Match', MatchSchema);
