import { User } from "../models/userModel.js";
import TryCatch from "../utils/tryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from 'cloudinary';
import bcrypt from 'bcrypt';

export const myProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
     res.json(user);
});

export const userProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user)
        return res.status(404).json({ 
    message: "No user with this ID" });

    res.json(user);
})

export const followandUnfollowUser = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if (!user)
        return res.status(404).json({ 
    message: "No user with this ID" });

    if (user._id.toString() === loggedInUser._id.toString())
        return res.status(400).json({ message: "You cannot follow yourself" });

    if (user.followers.includes(loggedInUser._id)){
        const indexFollowing = loggedInUser.followings.indexOf(user._id);
        const indexFollowers = user.followers.indexOf(loggedInUser._id);

        loggedInUser.followings.splice(indexFollowing, 1);
        user.followers.splice(indexFollowers, 1);

        await loggedInUser.save();
        await user.save();

       res.json({ message: "User unfollowed" });
        
    } else {
        loggedInUser.followings.push(user._id);
        user.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await user.save();

       res.json({ message: "User followed" });
    }
});

export const userFollowerandFollowingData = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password").populate("followers", "-password").populate("followings", "-password");

    const followers = user.followers;
    const followings = user.followings;

    res.json({followers, followings});
});

export const updateProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id)
    const {name} =  req.body

    if (name) {
        user.name = name;
    } 

    const file = req.file

    if (file) {
        const fileUrl = getDataUrl(file);

        await cloudinary.v2.uploader.destroy(user.profilePic.id);

        const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content)

        user.profilePic.id = myCloud.public_id;
        user.profilePic.url = myCloud.secure_url;
        
    }

    await user.save();

    res.json({message: "profile updated"});
});


export const updatePassword = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { currentPassword, newPassword } = req.body;


    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Both current and new passwords are required" });
    }


    if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long" });
    }

    // Comparing password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update and hash new password
    user.password = await bcrypt.hash(newPassword, 10);


    await user.save();


    res.json({ message: "Password updated successfully" });
});



export const searchUser = TryCatch(async (req, res) => {

    const search = req.query.search || "";
    const users = await User.find({
        name:{
            $regex: search,
            $options: 'i'  // case-insensitive search
        },
        _id: {$ne: req.user._id},
    }).select("-password");

    res.json(users);
});