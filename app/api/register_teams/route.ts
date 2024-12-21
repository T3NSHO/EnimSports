import db_connect from "@/lib/db_connect";
import { NextResponse } from "next/server";
import { teamModel } from "@/app/models/team-model";



export const POST = async (req: Request) => {
    
    await db_connect();
    const { team_name , description , team_leader , school , team_count } = await req.json();
    try {
        teamModel.create({
            team_name,
            team_description: description,
            school,
            members: [team_leader],
            members_count: team_count,
            team_leader,
        });

        
        return new NextResponse('Team created successfully', { status: 201 });
    }
    catch (err){ 
        if (typeof err === 'string') {
            return new NextResponse(err);
        }
        else if (err instanceof Error) {
        return new NextResponse(err.message, { status: 500 });
    }

}

}