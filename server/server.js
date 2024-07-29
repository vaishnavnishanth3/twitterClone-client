import express from "express"
import dotenv from "dotenv"

import dbConnection from "./db/connectMongoDB.js"
import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express();
const port = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: true })) //to parse form data

app.use(cookieParser())

app.use("/api/auth",authRoutes)

app.listen(port, () => {
    console.log(`\nServer running on http://localhost:${port}`)
    dbConnection()
})
