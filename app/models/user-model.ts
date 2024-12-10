import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    full_name: String,
    email: String,
    password: String,
    role: {type :String , default : "user"},
    team: String,
    school: String,
    phone_number : String,
    });


export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);