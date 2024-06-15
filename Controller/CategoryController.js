const Category = require("../Models/CategoryModel.js");

const createCategory = async(req,res) => {
    try {
        const {name} = req.body;
        const category = new Category({name})
        await category.save()
        res.json({
            messege: "category created.",
            category
        })
    } catch (error) {
        console.log(error)
    }
}

const allCategory = async(req,res) => {
    try {
        const categories = await Category.find()
        res.json(categories)
    } catch (error) {
        console.log(error)
    }
}
module.exports = {createCategory, allCategory}
