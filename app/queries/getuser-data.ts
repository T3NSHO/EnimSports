import {UserModel} from '../models/user-model';

export default function getuserdata( email:String , password:String ){
    const user = UserModel.findOne({email: email, password: password});
    return user;
}

export async function getoneuser(email:String){
    const user = await UserModel.findOne({email: email});
    return user;
}

