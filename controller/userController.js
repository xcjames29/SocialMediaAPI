const User = require("../model/userModel");
const Token = require("../model/tokenModel");

const addNewUser = async(username,email,password)=>{
    try{
        let usernameValid = await User.findOne({username:username});
        if(!usernameValid){
            let emailValid = await User.findOne({email:email});
            if(!emailValid){
                let user = new User({username:username,email:email,password:password});
                await user.save();
                return {status:true, result:"User Successfully Added"}
            }
            else return {status:false, result:"Email Already Taken!"}
        }
        else return {status:false, result:"Username Already Taken!"}
    }catch(e){
        console.log("ADD NEW USER",e.message);
        return {status:false, result:e.message}
    }
}

const loginAttemp = async(username,password)=>{
    try{
        let user =  await User.findOne({username:username});
        console.log("loginAttemp",user);
        if(!user) return {status: false, result: "User does not exist."} 
        else{
            if(user.password===password) return {status: true , result:user}
            else return {status: false , result: "Invalid Password"}
        }
    }
    catch(e){
        console.log("Login Attemp: ", e.message);
        return {status: false , result: e.message}
    }
   
}


const storeToken = async(token,userID)=>{
    try{
        let newToken = new Token({refreshToken:token,user:userID})
        await newToken.save();
        return {status:true, result:"Token is added"}
    }catch(e){
        console.log("store token",e.message);
        return{status:false , result:e.message}
    }
}

const updateToken = async(userId,newToken)=>{
    try {
        let token = await Token.findOneAndUpdate({user:userId}, {refreshToken:newToken})
        console.log(token);
    } catch (e) {
        console.log("Error",e.message)
        return {status: false, result: e.message}        
    }
}

const hasToken = async(userId)=>{
    try {
        let token = await Token.findOne({user:userId});
        if(token){
            return token.refreshToken
        }
        else{
            return false
        }
    } catch (e) {
        console.log("Error",e.message)
        return {status: false, result: e.message}        
    }
}

const deleteToken = async (refreshToken)=>{
    try{
        let token =  await Token.deleteOne({refreshToken:refreshToken});
        console.log(token);
        return {status:true , result:"Successfully Deleted token!"}
    }
    catch(e){
        console.log(e.message);
        return {status:false , result:e.message}
    }
}
module.exports ={
    addNewUser,
    storeToken,
    updateToken,
    hasToken,
    deleteToken,
    loginAttemp
}