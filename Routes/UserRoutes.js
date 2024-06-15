const express = require('express')
const { RegisterUser, LoginUser, profilePic, userdata, logout, subscribe, unsubscribe, mySubscribed, channelDetails, channelVideo } = require('../Controller/UserController.js')
const formidable = require('express-formidable')
const { requireLogin } = require('../MiddleWare/AuthMiddleware.js')
const router = express.Router()

router.post('/register',formidable(), RegisterUser)
router.post('/login', LoginUser)
router.get('/profilepic/:id', profilePic)
router.get('/userdata', userdata)
router.post('/logout', logout)
router.put('/subscribe/:id',requireLogin, subscribe)
router.put('/unsubscribe/:id',requireLogin, unsubscribe)
router.get('/subscribedchannel',requireLogin, mySubscribed)
router.get('/channeldetails/:id', channelDetails)
router.get('/channelvideo/:id', channelVideo)

module.exports = router