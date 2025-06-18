//Get all users except the logged-in user
import User from '../models/User.js';
import Message from '../models/message.js';


export const getUsersForSidebar = async (req,res) =>{
    try{
        const userId = req.user._id; // Get the logged-in user's ID from the request
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password"); // Exclude the logged-in user and password field

        const unseenMessages = {}
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({senderId:user._id,receiverId:userId,seen:false})
            if(messages.length > 0) {
                unseenMessages[user._id] = messages.length; // Count unseen messages for each user
            }
        })
        await Promise.all(promises); // Wait for all promises to resolve
        res.json({success: true, users: filteredUsers, unseenMessages});
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}