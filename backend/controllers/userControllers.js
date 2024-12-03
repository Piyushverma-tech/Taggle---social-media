import { User } from "../models/userModel.js";
import TryCatch from "../utils/tryCatch.js";

export const myProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
     res.json(user);
});

export const userProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user)
        return res.status(404).json({ 
    message: "User not found" });

    res.json(user);
})