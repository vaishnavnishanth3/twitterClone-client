import express from "express"
import dotenv from "dotenv"
import { v2 as cloudinary} from "cloudinary"

import dbConnection from "./db/connectMongoDB.js"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js"
import cookieParser from "cookie-parser"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express();
const port = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: true })) //to parse form data

app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)

app.listen(port, () => {
    console.log(`\nServer running on http://localhost:${port}`)
    dbConnection()
})
