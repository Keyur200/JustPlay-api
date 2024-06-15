const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    name:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    pic:{data:Buffer,contentType:String},
    pass:{type:String,required:true},
    subscribedUser:[{type:Schema.ObjectId,ref:'User'}],
    subscribers:{type:Number,default:0}
},{timestamps:true})

const User = model('User',UserSchema)

module.exports = User