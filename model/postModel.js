const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        unique:true
    },
    likes:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"User"
    }]
},{timespams:true})

const PostModel = new mongoose.model('Post',PostSchema);


module.exports = PostModel;