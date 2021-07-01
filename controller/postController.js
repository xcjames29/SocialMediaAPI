const Post = require("../model/postModel");


let addPost = async(content,author) =>{
    try{
        let post = new Post({content:content, author:author});
        await post.save();  
        return {status:true, return: "Post Successfully added"}
    }
    catch(e){
        console.log(e.message)
        return {status:false , return: e.message}
    }
}

let removePost = async(postID) =>{
    try{
        let deletePost = await Post.deleteOne({_id:postID});
        console.log(deletePost);
        return {status:true, return: "Post successffully deleted"}
    }
    catch(e){
        console.log(e.message)
        return {status:false , return: e.message}
    }
}


module.exports= {
    addPost,
    removePost,
}