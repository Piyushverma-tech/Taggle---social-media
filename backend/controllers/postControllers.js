import { Post } from "../models/postModel.js";
import TryCatch from "../utils/tryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from 'cloudinary';

export const newPost = TryCatch(async (req, res) => {
    const {caption} = req.body;

    const ownerId = req.user._id;

    const file = req.file;
    const fileUrl = getDataUrl(file);

    let option 

    const type = req.query.type;
    if (type === "reel"){
        option = {
            resource_type: "video"
        };
    } else{

        option = {};

    }
    const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content, option);

    const post = await Post.create({
        caption,
        post: {
            id: myCloud.public_id,
            url: myCloud.secure_url,
        },
        owner: ownerId,
        type,
    });

    res.status(201).json({
        message: "Post created successfully",
        post,
    });
});

export const deletePost = TryCatch(async (req, res) =>{
    const post = await Post.findById(req.params.id);

    if(!post) return res.status(404).json({
        message: "Post not found from this ID",
    });

    if (post.owner.toString() !== req.user._id.toString()) return res.status(403).json({
        message: "You are not authorized to delete this post",

    });

    await cloudinary.v2.uploader.destroy(post.post.id);
    await post.deleteOne();

    res.json({
        message: "Post deleted successfully",
    });

});

export const getAllPosts = TryCatch(async (req, res) => {
    const posts = await Post.find({type: 'post'}).sort({createdAt: -1}).populate("owner");
    const reels = await Post.find({type: 'reel'}).sort({createdAt: -1}).populate("owner");

    res.json({ posts, reels });
});