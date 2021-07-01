const User = require("../model/userModel");
const Token = require("../model/tokenModel");

const addNewUser = async (username, email, password) => {
    try {
        let usernameValid = await User.findOne({ username: username });
        if (!usernameValid) {
            let emailValid = await User.findOne({ email: email });
            if (!emailValid) {
                let user = new User({ username: username, email: email, password: password });
                await user.save();
                return { status: true, result: "User Successfully Added" }
            }
            else return { status: false, result: "Email Already Taken!" }
        }
        else return { status: false, result: "Username Already Taken!" }
    } catch (e) {
        console.log("ADD NEW USER", e.message);
        return { status: false, result: e.message }
    }
}

const loginAttemp = async (username, password) => {
    try {
        let user = await User.findOne({ username: username });
        console.log("loginAttemp", user);
        if (!user) return { status: false, result: "User does not exist." }
        else {
            if (user.password === password) return { status: true, result: user }
            else return { status: false, result: "Invalid Password" }
        }
    }
    catch (e) {
        console.log("Login Attemp: ", e.message);
        return { status: false, result: e.message }
    }

}


const storeToken = async (token, userID) => {
    try {
        let newToken = new Token({ refreshToken: token, user: userID })
        await newToken.save();
        return { status: true, result: "Token is added" }
    } catch (e) {
        console.log("store token", e.message);
        return { status: false, result: e.message }
    }
}

const updateToken = async (userId, newToken) => {
    try {
        let token = await Token.findOneAndUpdate({ user: userId }, { refreshToken: newToken })
        console.log(token);
    } catch (e) {
        console.log("Error", e.message)
        return { status: false, result: e.message }
    }
}

const hasToken = async (userId) => {
    try {
        let token = await Token.findOne({ user: userId });
        if (token) {
            return token.refreshToken
        }
        else {
            return false
        }
    } catch (e) {
        console.log("Error", e.message)
        return { status: false, result: e.message }
    }
}

const deleteToken = async (refreshToken) => {
    try {
        let token = await Token.deleteOne({ refreshToken: refreshToken });
        console.log(token);
        return { status: true, result: "Successfully Deleted token!" }
    }
    catch (e) {
        console.log(e.message);
        return { status: false, result: e.message }
    }
}

const addFollowing = async (followUsername, userID) => {
    try {
        let follow = await User.findOne({ username: followUsername });
        if (follow) {
            let followID = follow._id;
            let userData = await User.findOne({ _id: userID });
            let userFollowing = [...userData.following, followID];
            let addFollower = await User.findOneAndUpdate({ _id: userID }, { following: userFollowing })
            console.log("add Folowwing?",addFollower);
            return { status: true, result: "New Following Added" ,id:followID}
        }
        else return { status: false, result: "User does not exist!" };
    }
    catch (e) {
        console.log(e.message)
        return { status: false, result: e.message };
    }
}




let getUserIDwithEmail = async (email) => {
    try {
        let user = await User.findOne({ email: email });
        if (user) return { status: true, result: user };
        else return { status: false, result: "No user found with email:" + email }
    } catch (e) {
        console.log(e.message);
        return { status: false, result: e.message }
    }
}

let addFollower = async (userId, followerID) => {
    try {
        let userData = await User.findOne({ _id: followerID });
        let userFollowing = [...userData.follower, userId];
        let addFollower = await User.findOneAndUpdate({ _id: followerID }, { follower: userFollowing })
        console.log(addFollower);
        return { status: true, result: "New Following Added" }
    }
    catch (e) {
        console.log(e.message)
        return { status: false, result: e.message };
    }
}

const unfollowUser = async (followUsername, userID) => {
    try {
        let follow = await User.findOne({ username: followUsername });
        if (follow) {
            let followID = follow._id;
            let userData = await User.findOne({ _id: userID });
            let userFollowing = userData.following.reduce((acc, val) => {
                if (val.toString() !== followID.toString()) acc.push(val);
                return acc
            }, []);
            let addFollower = await User.findOneAndUpdate({ _id: userID }, { following: userFollowing })
            console.log(addFollower);
            return { status: true, result: "Unfollow Success!",id:followID }
        }
        else return { status: false, result: "User does not exist!" };
    }
    catch (e) {
        console.log(e.message)
        return { status: false, result: e.message };
    }
}

let removeFollowing = async(userID, followerID)=>{
    try{
        let followingData = await User.findOne({_id:followerID});
        let newFollowing = followingData.follower.reduce((acc,val)=>{
            console.log(val, userID);
            if(val.toString()!=userID.toString()) {
                console.log("PUMASOK???")
                acc.push(val);
            }
            return acc
        },[])
        console.log(newFollowing);
        console.log("sino ka?",followingData);
        let followingDataUpdate = await User.findOneAndUpdate({_id:followerID},{follower:newFollowing});
        console.log("New Following", followingDataUpdate);
        return {status:true, result:"Unfollow successful"}
    }
    catch(e){
        console.log(e.message);
        return {status:false, result:e.message}
    }
}

module.exports = {
    addNewUser,
    storeToken,
    updateToken,
    hasToken,
    deleteToken,
    loginAttemp,
    addFollowing,
    unfollowUser,
    getUserIDwithEmail,
    addFollower,
    removeFollowing,
}