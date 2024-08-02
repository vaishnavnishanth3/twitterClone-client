import Notification from "../models/notification.model.js";

export async function getNotifications(req, res) {
    try {
        const userId = req.user._id;
        const notification = await Notification.find({ to:userId }).populate({
            path: "from",
            select: "username profileImage"
        })

        await Notification.updateMany({ to : userId } , { read : true })
        res.json(notification);
    } catch (error) {
        console.log("Error in getNotification controller: ", error.message)
        res.status(500).send({ message: "Internal Server Error" })
    }
}

export async function deleteNotification(req, res) {
    try {
        const userId = req.user._id;
        const notificationId = req.params.id
        
        const notification = await Notification.findById(notificationId)

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" })
        }

        if (notification.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized" })
        }

        await Notification.findByIdAndDelete(notificationId)
        res.status(200).json({message: "Notification deleted successfully"})
        
    } catch (error) {
        console.log("Error in deleteNotification controller: ", error.message)
        res.status(500).send({ message: "Internal Server Error" })
    }
}

export async function deleteNotifications(req, res) {
    try {
        const userId = req.user._id;
        
        await Notification.deleteMany({ to : userId })

        res.status(200).json({message: "All Notifications deleted successfully"})
    } catch (error) {
        console.log("Error in deleteNotifications controller: ", error.message)
        res.status(500).send({ message: "Internal Server Error" })
    }
}

