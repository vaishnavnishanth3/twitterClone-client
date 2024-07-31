import express from "express"
import { getUserprofile, followUnfollowUser, getSuggestedUsers, updateUserProfile } from "../controllers/user.controllers.js"
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserprofile)
router.get("/suggested", protectRoute , getSuggestedUsers)
router.post("/follow/:id", protectRoute, followUnfollowUser)
router.post("/update", protectRoute , updateUserProfile)

export default router;
