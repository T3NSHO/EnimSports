import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    full_name: String,
    email: String,
    password: String,
    role: {type :String , default : "User"},
    team: String,
    school: String,
    phone_number : String,
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
    });


export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);