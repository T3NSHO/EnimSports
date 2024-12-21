import mongoose from 'mongoose';


const teamSchema = new mongoose.Schema({
    team_name: { type: String, required: true },
    team_description: String,
    school: { type: String, required: true },
    members_count: { type: Number, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // References User schema
    team_leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Team leader
    team_link : String,
});


export const teamModel = mongoose.models.Teams || mongoose.model('Teams', teamSchema);