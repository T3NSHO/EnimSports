import mongoose, { Schema, Document } from 'mongoose';

// Interface for Match Participant
interface IParticipant {
  id: string; // Store as plain string for flexibility
  name: string;
  isWinner: boolean;
  status: 'PENDING' | 'PLAYED' | 'IN_PROGRESS'; // had inprogress ra 3ad zdtiha la kan mochkil f compilation d match model !!
  resultText: 'WON' | 'LOST' | 'CHAMPION' | 'RUNNER-UP' | null;
}

// Interface for Match Document
export interface IMatch extends Document {
  id: number;
  name: string;
  tournamentId: mongoose.Types.ObjectId;
  nextMatchId: number | null;
  tournamentRoundText: string;
  startTime: string;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'PLAYED';
  participants: IParticipant[];
  team1Score?: number;
  team2Score?: number;
}

// Match Schema
const MatchSchema = new Schema<IMatch>(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true,
    },
    nextMatchId: { type: Number, default: null },
    tournamentRoundText: { type: String, required: true },
    startTime: { type: String, required: true },
    state: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'DONE', 'PLAYED'],
      default: 'PENDING',
      required: true,
    },
    participants: {
      type: [
        {
          id: { type: String, required: true }, // Use string for team ID reference
          name: { type: String, required: true },
          isWinner: { type: Boolean, default: false },
          status: {
            type: String,
            enum: ['PENDING', 'PLAYED', 'IN_PROGRESS'],
            default: 'PENDING',
          },
          resultText: {
            type: String,
            enum: ['WON', 'LOST', 'CHAMPION', 'RUNNER-UP', null],
            default: null,
          },
        },
      ],
      default: [], // Default to an empty array
      validate: [
        {
          validator: function (participants: any[]) {
            return participants.length <= 2;
          },
          message: 'A match can only have up to 2 participants',
        },
      ],
    },
    team1Score: { type: Number, default: null },
    team2Score: { type: Number, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual getters for team1Id and team2Id
MatchSchema.virtual('team1Id').get(function () {
  return this.participants?.[0]?.id || null;
});

MatchSchema.virtual('team2Id').get(function () {
  return this.participants?.[1]?.id || null;
});

// Methods to manage match state
MatchSchema.methods.updateScore = async function (team1Score: number, team2Score: number) {
  this.team1Score = team1Score;
  this.team2Score = team2Score;
  this.state = 'DONE';

  // Update participants
  if (this.participants.length === 2) {
    if (team1Score > team2Score) {
      this.participants[0].isWinner = true;
      this.participants[0].resultText = this.tournamentRoundText === 'Final' ? 'CHAMPION' : 'WON';
      this.participants[1].isWinner = false;
      this.participants[1].resultText = this.tournamentRoundText === 'Final' ? 'RUNNER-UP' : 'LOST';
    } else {
      this.participants[0].isWinner = false;
      this.participants[0].resultText = this.tournamentRoundText === 'Final' ? 'RUNNER-UP' : 'LOST';
      this.participants[1].isWinner = true;
      this.participants[1].resultText = this.tournamentRoundText === 'Final' ? 'CHAMPION' : 'WON';
    }
    this.participants[0].status = 'PLAYED';
    this.participants[1].status = 'PLAYED';
  }

  await this.save();
};

// Method to advance winner to next match
MatchSchema.methods.advanceWinner = async function () {
  if (this.nextMatchId && this.state === 'DONE') {
    const winner: IParticipant | undefined = this.participants.find((p: IParticipant) => p.isWinner);
    if (winner) {
      const nextMatch = await this.model('Match').findOne({ id: this.nextMatchId });
      if (nextMatch) {
        // Add winner to next match's participants
        nextMatch.participants.push({
          id: winner.id,
          name: winner.name,
          isWinner: false,
          status: 'PENDING',
          resultText: null,
        });
        await nextMatch.save();
      }
    }
  }
};

// Export Match Model
export const Match = mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);
