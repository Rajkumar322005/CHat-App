//Get all users except the logged-in user
import User from '../models/User.js';
import Message from '../models/message.js';
import {io,userSocketMap} from "../server.js"

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


//Get all messages for selected User
export const getMessages = async (req,res) =>{
    try{
        const {id: selectedUserId} = req.params;
        const myId = req.user._id;
        
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId}
            ]
        })
        await Message.updateMany(
            {senderId: selectedUserId, receiverId: myId},
            {seen: true}
        );
        res.json({success: true, messages});
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

//api to mark message as seen using messageId
export const markMessageAsSeen = async (req, res) => {
    try {
        const { Id } = req.params;

        // Update the message to mark it as seen
        await Message.findOneAndUpdate(Id,{ seen: true });
        res.json({ success: true });
        
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const sendMessage = async (req,res) =>{
    try{
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){

            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;

        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image : imageUrl
        })
        //Emit the new Messege to the receiver's socket 
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.json({success:true,newMessage});


    }
    catch(error){
        console.log(error.message);
        res.json({ success: false, message: error.message });
        
    }
}