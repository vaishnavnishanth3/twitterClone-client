import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js"
export async function signup( req , res) {
    try{
        const {fullName, username, email, password} = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid Email format" })
        }

        const exisitingUser = await User.findOne({ username });
        if (exisitingUser) {
            return res.status(400).json({ error: "Username already exists"})
        }

        const exisitingEmail = await User.findOne({ email })
        if (exisitingEmail) {
            return res.status(400).json({ error: "Email already exists"})
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        //HashPassword Here
        const newUser = new User({
            fullName,
            email,
            username,
            password: hashedPassword
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()
            res.status(201).json({ 
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                follower: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImage,
                coverImage: newUser.coverImage,
                bio: newUser.bio,
                link: newUser.link,
                message: "User created successfully" })
        } else {
                res.status(400).json({ message: "User not created" })
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
        console.log("Error while signing up: ", error.message)
    }
}

export async function login(req, res) {
       try{
            const {username, password} = req.body
            const user = await User.findOne({ username: username})
            const isPasswordValid = await bcrypt.compare(password, user?.password || "")

            if (!user || !isPasswordValid) {
                return res.status(400).json({ error: "Invalid Credentials" })
            }

            generateTokenAndSetCookie(user.id, res)

            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                follower: user.followers,
                following: user.following,
                profileImg: user.profileImage,
                coverImage: user.coverImage,
                bio: user.bio,
                link: user.link,
                message: "User logged in successfully!"
            })
       } catch (error) {
        console.log("Error while logging in: ", error.message)
        res.status(500).json({ error: "Internal Server Error" })
       }
}

export async function logout( req , res ) {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({ message: "User loggedout successfully!"})
    } catch (error) {
        console.log("Error while logout!", error.message)
        res.status(500).json({ error : "Internal Server Error"})
    }
}

export async function getMe( req , res ) {
    try {
        const user = await User.findById( req.user._id ).select( "-password" )
        res.status( 200 ).json( user )
    } catch ( error ) {
        console.log( "Internal Server Error" , error.message )
        res.status( 500 ).json( { error : "Internal Server Error" } )
    }
}
