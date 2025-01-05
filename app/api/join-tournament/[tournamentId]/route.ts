//@ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db_connect';
import Tournament from '@/app/models/tournament-model';
import {teamModel} from '@/app/models/team-model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export async function POST(req: NextRequest , {params} : {params: {tournamentId: string}}) {
  var ObjectId = require('mongoose').Types.ObjectId; 
  const { tournamentId } = params;
  if (!tournamentId) {
    return NextResponse.json({ error: 'Tournament ID is required' }, { status: 400 });
  }
  
  const tournamentObjectId = new ObjectId(tournamentId);
  
  if (!tournamentObjectId) {
    return NextResponse.json({ error: 'Invalid tournament ID' }, { status: 400 });
  }

  try {
    // Connect to the database
    await dbConnect();

    // Get the session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Find the tournament
    const tournament = await Tournament.findById(tournamentObjectId);
    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    // Check if tournament is full
    if (tournament.is_full) {
      return NextResponse.json({ error: 'Tournament has reached maximum team capacity' }, { status: 400 });
    }

    // Find the user's team (assuming user is a team leader)
    const userTeam = await teamModel.findOne({ team_leader: userId });
    if (!userTeam) {
      return NextResponse.json({ error: 'You must be the team leader to join a tournament , please contact your team leader or you can create your own team .' }, { status: 400 });
    }

    // Check if the team is already registered
    if (tournament.registered_teams.some((team: any) => team.toString() === userTeam._id.toString())) {
      return NextResponse.json({ error: 'Your team is already registered for this tournament' }, { status: 400 });
    }

    // Add the team to the tournament
    tournament.registered_teams.push(userTeam._id);
    await tournament.save();

    return NextResponse.json({ 
      message: 'Successfully registered team for the tournament',
      tournamentName: tournament.tournament_name 
    }, { status: 200 });
  } catch (error) {
    console.error('Error joining tournament:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}