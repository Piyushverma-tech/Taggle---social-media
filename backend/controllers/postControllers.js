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
    const posts = await Post.find({type: 'post'}).sort({createdAt: -1}).populate("owner", "-password");
    const reels = await Post.find({type: 'reel'}).sort({createdAt: -1}).populate("owner", "-password");

    res.json({ posts, reels });
});

export const likeUnlikePost = TryCatch(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({message: "No post found from this id"});

    if (post.likes.includes(req.user._id)) {
        const index = post.likes.indexOf(req.user._id);

        post.likes.splice(index, 1);

        await post.save();

        res.json({message: "Post unliked", post});
    } else {

        post.likes.push(req.user._id);
        await post.save();
        res.json({message: "Post liked", post});
    }
});

export const commentOnPost = TryCatch(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({message: "No post found from this id"});

    // post.comments.comment = req.body.comment;

    post.comments.push({
        user: req.user._id,
        name: req.user.name,
        comment: req.body.comment,
    });

    await post.save();
      
    res.json({message: "Comment added successfully", post});
});

export const deleteComment = TryCatch(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({message: "No post found from this id"});

    if (!req.body.commentId) return res.status(404).json({message:"please provide a comment Id"});

    const commentIndex = post.comments.findIndex((item) => item._id.toString() === req.body.commentId.toString());

    if(commentIndex === -1) return res.status(400).json({
        message: "Comment not found"
    });

    const comment = post.comments[commentIndex];

    if(post.owner.toString() === req.user._id.toString() || comment.user.toString() === req.user._id.toString()){
        post.comments.splice(commentIndex, 1);
         await post.save();

         return res.json({
            message:"comment deleted", post
         });

    } else {
        return res.json({
            message: "you are not allowed to delete this comment"
        });
    }

});

export const updateCaption = TryCatch(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({message: "No post found from this id"});

    if(post.owner.toString() === req.user._id.toString()) return res.status(403).json({
        message: "you are not authorized to edit this post",
    });

    post.caption = req.body.caption;
    
    await post.save();

    res.json({message: "Caption updated successfully", post});
});