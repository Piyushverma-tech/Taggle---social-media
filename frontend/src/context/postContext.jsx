import axios from "axios";
import { useEffect } from "react";
import { useContext, useState } from "react";
import { createContext } from "react";
import toast from "react-hot-toast";

const PostContext = createContext();

export const PostContextProvider = ({children}) => {
    const [posts, setPosts] = useState([]);
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchPost(){
        try {
            const {data}= await axios.get("/api/post/all");

            setPosts(data.posts);
            setReels(data.reels);
            setLoading(false);  
        } catch (error) {
            console.log(error);
            setLoading(false);
            
        }
    }

    const [addLoading, setAddLoading] = useState(false);

    async function addPost (formdata, setCaption, setFile, setPreview, type, setShowModal){
        setAddLoading(true);
        try {
            const {data}= await axios.post("/api/post/new?type="+type, formdata);

            toast.success(data.message);
            fetchPost();
            setCaption(""); // Reset fields
            setFile(null);
            setPreview(null);
            setAddLoading(false);
            setShowModal(false);
        } catch (error) {
            toast.error(error.response.data.message);
            setAddLoading(false);
        }
    }

    async function likePost(id) {
        try {
            const { data } = await axios.post(`/api/post/like/${id}`);
            toast.success(data.message);
            fetchPost();
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    }

    async function addComment(id, comment, setComment, setShow) {
        try {
            const { data } = await axios.post(`/api/post/comment/${id}`, {comment,});
            toast.success(data.message);
            fetchPost();
            setComment("");
            setShow(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    }

    async function deletePost (id){
        setLoading(true); 
        try {
            const {data} = await axios.delete("/api/post/" + id);
            toast.success(data.message);
            fetchPost();
            setLoading(false);  // 
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
            setAddLoading(false);
        }
    }

    async function deleteComment(id, commentId) {
        try {
            const {data} = await axios.delete(`/api/post/comment/${id}?commentId=${commentId}`);
            toast.success(data.message);
            fetchPost();
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    }

    useEffect(()=> {
        fetchPost();
    },[]);

    return <PostContext.Provider value={{reels, posts, addPost, likePost, addComment, loading, addLoading, fetchPost, deletePost, deleteComment }} >{children}</PostContext.Provider>
}

export const PostData = () => useContext(PostContext);
