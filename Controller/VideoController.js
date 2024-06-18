const { default: slugify } = require("slugify");
const Video = require("../Models/VideoModel.js");
const fs = require('fs');
const User = require("../Models/UserModel.js");
const Category = require("../Models/CategoryModel.js");
const createVideo = async (req, res) => {
    try {
        const { title, desc, category, slug, thumb,video } = req.body;

        const videos = await Video.create({ title, desc, category, slug: slugify(title),thumb,video, createdBy: req.user._id })
        res.json({
            mes: "Video created.",
            videos
        })
    } catch (error) {
        console.log(error)
    }
}

const allVideos = async(req,res) => {
    try {
        // const videos = await Video.find().populate('category').populate('createdBy').sort({createdAt: -1})
        const videos = await Video.aggregate([{$sample : {size: 20}}])
        await User.populate(videos,{path: "createdBy"})
        await Category.populate(videos,{path: "category"})
        return res.json(videos)
    } catch (error) {
        console.log(error)
    }
}


const deletevideo = async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id)
        res.json("Video deleted.")
    } catch (error) {
        console.log(error)
    }
}

const addView = async (req, res) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 }
        }, { new: true })
        res.json("view added.")
    } catch (error) {
        console.log(error)
    }
}

const videodetail = async (req, res) => {
    try {
        const video = await Video.find({ slug: req.params.slug }).populate('createdBy','_id pic name email subscribedUser subscribers').populate('category')
        res.json(video)
    } catch (error) {
        console.log(error)
    }
}

const trendingVideo = async (req, res) => {
    try {
        const videos = await Video.find({}).populate('createdBy').sort({ views: -1 })
        res.json(videos)
    } catch (error) {
        console.log(error)
    }
}

const likes = async (req, res) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $addToSet: { likes: req.user._id },
            $pull: { dislikes: req.user._id }
        }, { new: true })
        res.json("Video has been liked.")

    } catch (error) {
        console.log(error)
    }
}

const dislikes = async (req, res) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $addToSet: { dislikes: req.user._id },
            $pull: { likes: req.user._id }
        }, { new: true })
        res.json("Video has been disliked.")

    } catch (error) {
        console.log(error)
    }
}
module.exports = { createVideo, allVideos,  deletevideo, addView, videodetail, trendingVideo, likes, dislikes }