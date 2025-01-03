//@ts-nocheck
import { teamModel } from "@/app/models/team-model";
import dbconnect from "@/lib/db_connect";
import { NextRequest , NextResponse } from "next/server";
import {getServerSession} from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";




export async function POST(req: NextRequest) {
    var ObjectId = require('mongoose').Types.ObjectId; 
    const { searchParams } = new URL(req.url);
    const tempteamId = searchParams.get("tempteamId");
    if (!tempteamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }
    
    const teamId = new ObjectId(tempteamId);
    console.log(teamId);
    if (!teamId) {
      return NextResponse.json({ error: 'Invalid team ID' }, { status: 400 });
    }
  
    try {
      // Connect to the database
      await dbconnect();
  
      // Get the session
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const userId = session.user.id as string;
  
      // Find the team
      const team = await teamModel.findById({_id : teamId});
      if (!team) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 });
      }
  
      // Check if the user is already a member
      if (team.members.includes(userId)) {
        return NextResponse.json({ error: 'You are already a member of this team' }, { status: 400 });
      }
  
      // Add the user to the team
      team.members.push(userId);
      await team.save();
  
      return NextResponse.json({ message: 'Successfully joined the team' }, { status: 200 });
    } catch (error) {
      console.error('Error joining team:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  