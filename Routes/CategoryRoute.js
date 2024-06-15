const express = require('express')
const { createCategory, allCategory } = require('../Controller/CategoryController.js')

const router = express.Router()

router.post('/createcategory', createCategory)
router.get('/allcategory', allCategory)

module.exports = router