import db_connect from "@/lib/db_connect";
import { NextResponse } from "next/server";
import { teamModel } from "@/app/models/team-model";



export const POST = async (req: Request) => {
    
    await db_connect();
    const {team_ids} = await req.json();
    console.log(team_ids);
    const teams = await teamModel.find({ _id: { $in: team_ids } }).select('team_name');
    console.log(teams);
    const teamNames = teams.map(team => team.team_name);
    return NextResponse.json(teamNames);
}
