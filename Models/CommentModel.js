const {Schema, default: mongoose, model} = require('mongoose')

const CommentSchema = new Schema({
    userId: {type:mongoose.Types.ObjectId, ref: "User"},
    videoId: {type:String, required:true},
    text: {type:String, required: true}
},{timestamps:true})

const Comments = model('Comment', CommentSchema)

module.exports = Comments