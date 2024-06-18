const User = require("../Models/UserModel.js");
const fs = require('fs')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Video = require("../Models/VideoModel.js");
const RegisterUser = async (req, res) => {
    try {
        const { name, email, pass, pic } = req.body;

        const nameCheck = await User.findOne({ name })
        if (nameCheck) {
            return res.json({ error: "Name already used." })
        }

        const emailCheck = await User.findOne({ email })
        if (emailCheck) {
            return res.json({ error: "Email already used." })
        }
        const hashPass = await bcrypt.hash(pass, 10)
        const UserDoc = await User.create({ name,email,pic, pass: hashPass })
        
        return res.json({
            mes: "User created successfully.",
            UserDoc
        })
    } catch (error) {
        console.log(error)
    }
}

const LoginUser = async (req, res) => {
    try {
        const { email, pass } = req.body;
        const emailCheck = await User.findOne({ email }).select("-pic")

        if (!emailCheck) {
            return res.json({ error: "Incorrect email and password." })
        }
        else {
            const passCheck = await bcrypt.compare(pass, emailCheck.pass)
            if (!passCheck) {
                return res.json({ error: "Incorrect email and password." })
            }
            else {
                jwt.sign({ _id: emailCheck._id }, process.env.SECRET, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token,{
                        httpOnly: true,
                            sameSite: "none",
                            secure: true,
                    }).json({ user: emailCheck, token })
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}


const userdata = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (token) {
            jwt.verify(token, process.env.SECRET, {}, async (err, user) => {
                if (err) throw err;
                const { name, email, _id,pic, subscribers,subscribedUser } = await User.findById(user._id)
                res.json({ _id, name, email,pic, token, subscribers,subscribedUser })
            })
        }
    } catch (error) {
        console.log(error)
    }
}

const logout = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    }).json("Logout")

}

const subscribe = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { subscribedUser: req.params.id }
        }, { new: true })
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 }
        }, { new: true })
        res.status(200).json("Subscription successfull.")
    } catch (error) {
        console.log(error)
    }
}

const unsubscribe = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { subscribedUser: req.params.id }
        }, { new: true })
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 }
        }, { new: true })
        res.status(200).json("Unsubscription successfull.")
    } catch (error) {
        console.log(error)
    }
}

const mySubscribed = async(req,res) => {
    try {
        const channels = await User.findById(req.user._id).populate('subscribedUser','email pic name _id subscribers').select("-pass")
        res.json(channels)
    } catch (error) {
        console.log(error)
    }
}

const channelDetails = async(req,res) => {
    try {
        const userdata = await User.findById(req.params.id).select("-pass")
        res.json(userdata)
    } catch (error) {
        console.log(error)
    }
}

const channelVideo = async(req,res)=>{
    try {
        // const data = await User.findById(req.params.id).select("-pic").select("-pass")
        const video = await Video.find({createdBy: req.params.id}).populate('category').populate('createdBy').sort({createdAt:-1})
        res.json(video)
    } catch (error) {
        console.log(error)
    }
}
module.exports = { RegisterUser, LoginUser, userdata, logout, subscribe, unsubscribe,mySubscribed,channelDetails, channelVideo }