import mongoose, {Types} from 'mongoose';    

const messageSchema = new mongoose.Schema({
  senderId: {type: mongoose.Schema.Types.ObjectId, ref: "User",required: true},
  receiverId: {type: mongoose.Schema.Types.ObjectId, ref: "User",required: true},
    text: {type: String, required: true},
    image: {type:string},
    seen: {type: Boolean,default: false},


},{timestamps : true});

const message = mongoose.model("Message ", messageSchema);
export default message;
