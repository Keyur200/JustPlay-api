const express  = require('express')
const mongoose  = require('mongoose')
const cors  = require('cors')
const dotenv  = require('dotenv')
const UserRoutes = require('./Routes/UserRoutes.js')
const CategoryRoutes = require('./Routes/CategoryRoute.js')
const VideoRoutes = require('./Routes/VideoRoutes.js')
const CommentRoutes = require('./Routes/CommentRoutes.js')
const cookieParser = require('cookie-parser')
dotenv.config()

const app = express()
app.use(cors({origin: "http://localhost:3000",credentials:true}))
app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("MongoDB connected."))

app.use('/auth/', UserRoutes)
app.use('/', CategoryRoutes)
app.use('/', VideoRoutes)
app.use('/', CommentRoutes)

app.listen(process.env.PORT, () => console.log(`Port connected on ${process.env.PORT}`))