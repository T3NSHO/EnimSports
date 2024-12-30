
import dbconnect from '@/lib/db_connect';
import mongoose from 'mongoose';


const TournamentFormatEnum = ['league', 'champions'] as const;


interface ITournament extends mongoose.Document {
  tournament_name: string;
  tournament_organizer: mongoose.Types.ObjectId;
  location: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  max_teams: number;
  tournament_type: string;
  sport_type?: string;
  esport_game?: string; 
  tournament_format: string;
  prize?: string;
  registered_teams?: mongoose.Types.ObjectId[];
  status?: 'upcoming' | 'ongoing' | 'completed';
  created_at?: Date;
  updated_at?: Date;
}


const TournamentSchema = new mongoose.Schema<ITournament>(
  {
    tournament_name: {
      type: String,
      required: [true, 'Tournament name is required'],
      trim: true,
      maxlength: [100, 'Tournament name cannot exceed 100 characters'],
    },
    tournament_organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Tournament organizer is required'],
    },
    location: {
      type: String,
      required: [true, 'Tournament location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    start_date: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    end_date: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (this: ITournament, value: Date) {
          return value > this.start_date;
        },
        message: 'End date must be after start date',
      },
    },
    max_teams: {
      type: Number,
      required: [true, 'Maximum number of teams is required'],
      min: [2, 'At least 2 teams are required'],
      max: [128, 'Maximum 128 teams allowed'],
    },
    tournament_type: {
      type: String,
      required: [true, 'Tournament type is required'],
    },
    sport_type: {
      type: String,
      trim: true,
    },
    esport_game: {
      type: String,
      trim: true,
    },
    tournament_format: {
      type: String,
      required: [true, 'Tournament format is required'],
    },
    prize: {
      type: String,
      trim: true,
      maxlength: [100, 'Prize description cannot exceed 100 characters'],
    },
    registered_teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming',
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


TournamentSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});


TournamentSchema.virtual('is_full').get(function () {
  return this.registered_teams && this.registered_teams.length >= this.max_teams;
});



const Tournament =
  mongoose.models.Tournament ||
  mongoose.model<ITournament>('Tournament', TournamentSchema);

export default Tournament;
