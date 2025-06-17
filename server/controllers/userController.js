//Sign up a new User
import User from '../models/User.js';
import { generateToken } from '../lib/util.js';
 
export const signup = async (req,res) => {
    const { fullName, email , password , bio } = req.body;

    try {
        // Check if user already exists
        if(!fullName || !email || !password || !bio) {
            return res.json({success: false, message: "Please fill all the fields"});
        }

        const user = await User.findOne({email});
        if(user) {
            return res.json({success: false, message: "User already exists"});
        }

        const salt = await  bcrypt.genSalt(10);;
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            bio
        });
        const token = generateToken(newUser._id);
        res.json({success: true, userData:newUser,token,message:"Account created Successfullyy"})

    }
    catch (error) {
        res.json({success: false, message:error.message});
        console.log(error.message);

    }
}

