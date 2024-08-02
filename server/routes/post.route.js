import express from "express"
import { createPost, likeUnlikePost, commentOnPost, deletePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts } from "../controllers/post.controller.js"
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts)
router.get("/user/:username", protectRoute, getUserPosts)
router.get("/following", protectRoute, getFollowingPosts)
router.get("/likedPosts/:id", protectRoute, getLikedPosts)
router.post("/create", protectRoute, createPost)
router.post("/like/:id", protectRoute, likeUnlikePost)
router.post("/comment/:id", protectRoute, commentOnPost)
router.delete("/:id", protectRoute, deletePost)

export default router;
