const express = require('express')
const {requireLogin} = require('../MiddleWare/AuthMiddleware.js')
const { addComment, getcomment } = require('../Controller/CommentsController.js')
const router = express.Router()

router.post('/addcomment',requireLogin, addComment)
router.get('/getcomment/:vid', getcomment)

module.exports = router