import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export async function protectRoute( req , res , next ) {
    
    try {
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({ error : "Unauthroized : No token provided" })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(400).json({ error : "Invalid token" })
        }

        const user = await User.findById(decoded.userId).select("-password")

        if(!user) {
            return res.status(404).json({ error : "User not found" })
        }

        req.user = user;
        next();

    } catch ( error ) {
        console.log("Error while productRoute middleware", error.message )
        res.status(500).json({ error: "Internal Server Error" })
    }   
}
