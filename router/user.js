const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const UserController = require("../controller/userController");
const PostController = require("../controller/postController")


router.route("/signup")
.post(async(req,res)=>{
    try{
        console.log("Signup",req.body);
        let {username,email,password} = req.body;
        let result = await UserController.addNewUser(username,email,password);
        console.log("ANOKA? ,", result);
        if(result.status) res.status(200).send(result.result)
        else res.status(400).send(result.result)
    }
    catch(e){
        console.log(e.message);
        res.status(400).send(e.message)
    }
})


router.route("/login")
.post(async(req,res)=>{
    try{
        console.log("Login",req.body);
        let {username,password} = req.body;
        let login = await UserController.loginAttemp(username,password);
        if(login.status){
            let payload = {
                "email": login.result.email
            }
            let token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME});
            let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME });
            let refreshTokenSave = await UserController.storeToken(refreshToken,login.result._id);
            if(refreshTokenSave.status) res.status(200).send({"ACCESS_TOKEN":token});
            else res.status(400).send(refreshTokenSave.result)
        }
        else res.status(400).send(login.result);
    }
    catch(e){
        console.log("ditoError?",e.message);
        res.status(400).send(e.message);
    }
})


router.post("/token",async(req,res)=>{
    console.log("GET NEW TOKEN: ", req.body);
    let { refreshToken } = req.body;
    try{
        let data = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        console.log(data);
        let newToken = jwt.sign({email:data.email},process.env.ACCESS_TOKEN_SECRET,{expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME});
        res.status(200).send({ACCESS_TOKEN:newToken});
    }
    catch(e){
        console.log(e.message);
        res.status(400).send("Refresh Token Expired. Please Login Again.");
    }
})


router.post("/logout",async(req,res)=>{
    console.log("LOGOUT: ", req.body);
    let {refreshToken} = req.body;
    try{
        let data= await UserController.deleteToken(refreshToken);
        if(data.status) res.status(200).send("Logout Successful")
        else res.status(400).send(data.result)
    }
    catch(e){
        console.log(e.message)
        res.status(400).send(e.message)
    }
})


router.get("/follow/:username", async(req,res)=>{
    let header = req.headers["authorization"];
    if(!header){
        res.status(403).send("Token not provided!");
        return;
    }
    else{
        try{
            let {username} = req.params;
            let token = header.split(" ")[1];
            let verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log(verifyToken);
            let {email} = verifyToken;
            let userId = await UserController.getUserIDwithEmail(email);
            console.log("nakuha?", userId.result)
            if(userId.status){
                let data = await UserController.addFollowing(username,userId.result._id);
                console.log("anoka?????:",data);
                if(data.status) {
                    let addFollower = await UserController.addFollower(userId.result._id,data.id);
                    if(addFollower.status) res.status(200).send("Follow Success!");
                    else res.status(400).send(addFollower.result);
                }
                else res.status(400).send(data.result);
            }
            else res.status(400).send("Invalid Email from token");
        }
        catch(e){
            console.log("Follow",e.message);
            res.status(403).send("Token is expired")
        }
    }
})


router.get("/unfollow/:username", async(req,res)=>{
    let header = req.headers["authorization"];
    if(!header){
        res.status(403).send("Token not provided!");
        return;
    }
    else{
        try{
            let {username} = req.params;
            let token = header.split(" ")[1];
            let verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log(verifyToken);
            let {email} = verifyToken;
            let userId = await UserController.getUserIDwithEmail(email);
            console.log("nakuha?", userId.result)
            if(userId.status){
                let data = await UserController.unfollowUser(username,userId.result._id);
                console.log("anoka?????:",data);
                if(data.status){
                    let removeFollowing = await UserController.removeFollowing(userId.result._id,data.id)
                    if(removeFollowing.status) res.status(200).send(removeFollowing.result);
                    else res.status(400).send(removeFollowing.result);
                }
                else res.status(400).send(data.result);
            }
            else res.status(400).send("Invalid Email from token");
        }
        catch(e){
            console.log("Follow",e.message);
            res.status(403).send("Token is expired")
        }
    }
})

router.route("/post/:id")
.get(async(req,res)=>{


})
.post(async(req,res)=>{

})
.delete(async(req,res)=>{
    let {id} = req.params;
    try{
        let deleteID = await PostController.removePost(id)
        console.log(deleteID);
        res.status(200).send("Successfully Deleted")
    }
    catch(e){
        console.log(e.message);
        res.status(400).send(e.message);
    }
})




module.exports = router;