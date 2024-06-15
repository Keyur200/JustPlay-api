const express = require('express')
const { createVideo, getThumb, getvideo, deletevideo, addView, videodetail, trendingVideo, likes, dislikes, allVideos } = require('../Controller/VideoController.js')
const { requireLogin } = require('../MiddleWare/AuthMiddleware.js')
const formidable = require('express-formidable') 
const router = express.Router()

router.post('/uploadvideo',requireLogin,formidable(), createVideo)
router.get('/getvideos', allVideos)
router.get('/thumb/:id', getThumb)
router.get('/video/:id', getvideo)
router.delete('/deletevideo/:id', deletevideo)
router.put('/view/:id', addView)
router.get('/videodetail/:slug', videodetail)
router.get('/trending', trendingVideo)
router.put('/likes/:id', requireLogin, likes)
router.put('/dislikes/:id', requireLogin, dislikes)

module.exports = router