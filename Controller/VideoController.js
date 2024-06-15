const { default: slugify } = require("slugify");
const Video = require("../Models/VideoModel.js");
const fs = require('fs');
const User = require("../Models/UserModel.js");
const createVideo = async (req, res) => {
    try {
        const { title, desc, category, slug } = req.fields;
        const { thumb, video } = req.files;

        const videos = new Video({ title, desc, category, slug: slugify(title), createdBy: req.user._id })
        if (thumb) {
            videos.thumb.data = fs.readFileSync(thumb.path)
            videos.thumb.contentType = thumb.type
        }
        if (video) {
            videos.video.data = fs.readFileSync(video.path)
            videos.video.contentType = video.type
        }
        await videos.save()
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
        const videos = await Video.find().populate('category').populate('createdBy').select("-thumb").select("-video").sort("createdAt")
        return res.json(videos)
    } catch (error) {
        console.log(error)
    }
}

const getThumb = async (req, res) => {
    try {
        const thumb = await Video.findById(req.params.id).select("thumb")
        if (thumb.thumb.data) {
            res.set('Content-type', thumb.thumb.contentType)
            return res.status(200).send(thumb.thumb.data)
        }
    } catch (error) {
        console.log(error)
    }
}

const getvideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id).select("video")
        if (video.video.data) {
            res.set('Content-type', video.video.contentType)
            return res.status(200).send(video.video.data)
        }
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
        }, { new: true }).select("-thumb").select("-video")
        res.json("view added.")
    } catch (error) {
        console.log(error)
    }
}

const videodetail = async (req, res) => {
    try {
        const video = await Video.find({ slug: req.params.slug }).populate('createdBy','_id name email subscribedUser subscribers').populate('category').select("-thumb").select("-video")
        res.json(video)
    } catch (error) {
        console.log(error)
    }
}

const trendingVideo = async (req, res) => {
    try {
        const videos = await Video.find({}).populate('createdBy').sort({ views: -1 }).select("-thumb").select("-video")
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
module.exports = { createVideo, allVideos, getvideo, getThumb, deletevideo, addView, videodetail, trendingVideo, likes, dislikes }