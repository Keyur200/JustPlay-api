const Comments = require("../Models/CommentModel.js");

const addComment = async(req,res) => {
    try {
        const {text,vid} = req.body;
        const comment = new Comments({text,videoId:vid,userId:req.user._id})
        await comment.save()
        res.json(comment)
    } catch (error) {
        console.log(error)
    }
}

const getcomment = async (req,res) => {
    try {
        const comments = await Comments.find({videoId: req.params.vid}).sort({createdAt : -1}).populate('userId').populate('videoId')
        res.json(comments)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {addComment,getcomment}