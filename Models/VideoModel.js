const {Schema, default: mongoose, model} = require('mongoose')

const VideoSchema = new Schema({
    title:{type:String,required:true,unique:true},
    slug:{type:String,lowercase:true,unique:true},
    desc:{type:String,required:true},
    thumb:{data:Buffer,contentType:String},
    video:{data:Buffer,contentType:String},
    category:{type:mongoose.Types.ObjectId, ref:'Category'},
    createdBy:{type:mongoose.Types.ObjectId, ref:'User'},
    views:{type:Number,default: 0},
    likes:{type:[String], default:[]},
    dislikes:{type:[String], default:[]},
},{timestamps:true})

const Video = model('Video',VideoSchema)

module.exports = Video