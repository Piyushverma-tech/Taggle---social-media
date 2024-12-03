import { User } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import TryCatch from "../utils/tryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";

export const resigteUser = TryCatch(async(req, res) => {
    const {name, email, password, gender} = req.body

        const file = req.file;

        if(!name || !email || !password || !gender || !file) {
            return res.status(400).json({
                message: "Please Provide all required details",
            });
        }

        let user = await User.findOne({email})

        if (user) {
            return res.status(400).json({
                message: "User with this email already exists",
            });
        }

        const fileUrl = getDataUrl(file)

        const hashPassword = await bcrypt.hash(password, 10);

        const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content);

        user = await User.create({
            name,
            email,
            password: hashPassword,
            gender,
            profilePic: {
                id: myCloud.public_id,
                url: myCloud.secure_url,    
            },
        });

        generateToken(user._id, res)

        res.status(201).json({
            message: "User registered successfully",
            user,
        });

})

export const loginUser = TryCatch(async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user) 
        return res.status(404).json({
            message: "User not found, unvalid credentials",
        });
    
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword)
        return res.status(404).json({
            message: "Invalid credentials",
        });

        generateToken(user._id, res);

        res.json({
            message: "User logged in successfully",
            user
        });
})

export const logoutUser = TryCatch((req, res) => {
    res.cookie("token", "", {maxAge: 0});

    res.json({
        message: "User logged out successfully",
    });
});