import mongoose from 'mongoose';


export default async function dbconnect(){
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        return conn;
    }
    catch (e) {
        if (e instanceof Error) {
            throw new Error(e.message);
        } else {
            throw new Error(String(e));
        }
    }
}