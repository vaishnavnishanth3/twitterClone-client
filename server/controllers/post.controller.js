import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js"
import { v2 as cloudinary } from "cloudinary";

export async function getAllPosts(req, res) {
    try {
        const posts = await Post.find().populate({
            path: "user",
            select: "fullName username profileImage"
        }).populate({
            path: "comments.user",
            select: "username"
        }).sort({ createdAt: -1 })
        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in getAllPosts Controller: ", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function getLikedPosts(req, res) {
    try {
        const userId = req.params.id
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ error : "User not Found" })
        }

        const likedPosts = await Post.find({ _id: {$in : user.likedPosts }}).populate({
            path: "user",
            select: "fullName username profileImage"
        }).populate({
            path: "comments.user",
            select: "username"
        });
    } catch (error) {
        console.log("Error in getLikedPosts Controller: ", error.message)
        res.status(500).json({ error : "Internal Server Error"})
    }
}

export async function getFollowingPosts(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ error : "User not Found" })
        }

        const followingUsers = user.following;

        const feedPosts = await Post.find({ user: { $in : followingUsers} }).sort({ createdAt : -1 }).populate({
            path: "user",
            select: "fullName username profileImage"
        }).populate({
            path: "comments.user",
            select: "username"
        })
        res.status(200).json(feedPosts)
    } catch (error) {
        console.log("Error in getFollowingPost Controller: ", error.message)
        res.status(500).json({ error : "Internal Server Error" })
    }
}

export async function getUserPosts(req, res) {
    try {
        const username = req.params.username;
        const user = await User.find({ username: username })
        if (!user) {
            return res.status(404).json({ error : "User not Found" })
        }

        const posts = await Post.find({ user: user._id }).populate({
            path: "user",
            select: "fullName username profileImage"
        }).populate({
            path: "comments.user",
            select: "username"
        }).sort({ createdAt : -1})

        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in getUserPosts controller: ", error.message)
        res.status(500).json({ error : "Internal Server Error"})
    }
}

export async function createPost(req, res) {
    try{
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString()

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ error : "User not Found" })
        }

        if (!text && !img) {
            return res.status(400).json({ error : "Post must contain an image or text"})
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save()
        res.status(201).json(newPost)

    } catch (error) {
        console.log("Error in createPost Controller: ", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function deletePost(req, res) {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post"})
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(imgId)
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message : "Post Deleted Successfully! "})

    } catch (error) {
        console.log("Error in deletePostcontroller: ", error.message)
        res.status(500).json({ error : "Internal Server Error"})
    }
}

export async function likeUnlikePost(req, res) {
    try {
        const userId = req.user._id
        const { id:postId } = req.params
        const post = await Post.findById(postId)
        const user = await User.findById(userId)

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const isLikedByUser = post.likes.includes(userId);

        if (isLikedByUser) {
            // unlike the post
            await Post.findByIdAndUpdate({ _id: postId}, {
                $pull: { likes: userId }
            })

            await User.findByIdAndUpdate({ _id: userId}, {
                $pull: { likedPosts : postId}  
            })
            res.status(200).json({ message : "Post Uniked Successfully"})
        } else {
            // like the post
            await Post.findByIdAndUpdate(postId, {
                $push: { likes: userId }
            })
            await User.findByIdAndUpdate({ _id: userId}, {
                $push: { likedPosts : postId}
            })

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })

            await notification.save();
            res.status(200).json({ message: "Post Liked Successfully"})
        }

        await post.save();
    } catch (error) {
        console.log("Error in likeUnlikePostcontroller: ", error.message)
        res.status(500).json({ error : "Internal Server Error"})
    }
}

export async function commentOnPost(req, res) {
    try {
        const { text } = req.body;
        const postId = req.params.id
        const userId = req.user._id

        if (!text) {
            return res.status(400).json({ error : "Comment text is required"})
        }

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        const comment = { user: userId, text }

        post.comments.push(comment);

        await post.save();

        res.status(200).json(post);

    } catch (error) {
        console.log("Error in commentOnPostcontroller: ", error.message)
        res.status(500).json({ error : "Internal Server Error"})
    }
}
