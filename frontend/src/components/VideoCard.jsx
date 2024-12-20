import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaShare } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { UserData } from "../context/userContext";
import { PostData } from "../context/postContext";
import { format } from "date-fns";
import { MdDelete } from "react-icons/md";
import EditModal from "./EditModal";
import toast from "react-hot-toast";
import axios from "axios";
import { LoadingAnimation } from "./Loading";

const VideoCard = ({ type, value }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isCommented, setIsCommented] = useState(false);
  const [show, setShow] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [comment, setComment] = useState('');
  const { user } = UserData();
  const { likePost, addComment, deletePost, fetchPost } = PostData();

  const formatDate = format(new Date(value.createdAt), "MMMM do");

  useEffect(() => {
    if (value.likes.includes(user._id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }

    const userHasCommented = value.comments.some(
      (c) => c.user._id === user._id
    );
    setIsCommented(userHasCommented);
  }, [value.likes, value.comments, user._id]);

  const handleLike = async () => {
    try {
      await likePost(value._id);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await addComment(value._id, comment, setComment, setShow);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDelete = () => {
    deletePost(value._id);
  };

  const [showInput, setShowInput] = useState(false);

  const handleEdit = () => {
    setShowModal(false);
    setShowInput(true);
  };

  const [caption, setCaption] = useState(value.caption ? value.caption : "");
  const [captionLoading, setCaptionLoading] = useState(false);

  async function updateCaption() {
    setCaptionLoading(true);
    try {
      const { data } = await axios.put("/api/post/" + value._id, { caption });
      toast.success(data.message);
      fetchPost();
      setShowInput(false);
      setCaptionLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      setCaptionLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col items-center max-w-screen-md mx-auto bg-slate-400 bg-opacity-30 shadow-md rounded-md overflow-hidden mb-6 mt-6">
      <EditModal isOpen={showModal} onClose={closeModal}>
        <div className="flex flex-col items-center justify-center gap-3 overflow-hidden">
          <button className="text-gray-800 font-medium px-28 py-2 hover:bg-gray-100 transition duration-300" onClick={handleEdit}>Edit</button>
          <button className="text-gray-800 font-medium px-28 py-2 hover:bg-gray-100 transition duration-300" onClick={handleDelete}>Delete</button>
        </div>
      </EditModal>

      {/* Video Content */}
      <div className="relative w-full h-[75vh] bg-black">
        {type === "post" ? (
          <img
            src={value.post.url}
            alt="Post"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            autoPlay
            loop
            controls
            src={value.post.url}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-4 left-4 text-white">
          <Link to={`/user/${value.owner._id}`} className="flex items-center gap-2">
            <img
              src={value.owner.profilePic.url}
              alt={`${value.owner.name}'s profile`}
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />
            <div>
              <p className="font-semibold">{value.owner.name}</p>
              <p className="text-sm">{formatDate}</p>
            </div>
          </Link>
          <p className="mt-2 text-sm">{value.caption}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6 text-white">
        <button
          onClick={handleLike}
          className={`flex flex-col items-center ${isLiked ? "text-red-500" : "text-white"}`}
        >
          <FaHeart size={28} />
          <span className="text-sm mt-1">{value.likes.length}</span>
        </button>
        <button
          onClick={() => setShow(!show)}
          className={`flex flex-col items-center ${isCommented ? "text-blue-500" : "text-white"}`}
        >
          <FaComment size={28} />
          <span className="text-sm mt-1">{value.comments.length}</span>
        </button>
        <button
          onClick={() => setIsShared(!isShared)}
          className={`flex flex-col items-center ${isShared ? "text-green-500" : "text-white"}`}
        >
          <FaShare size={28} />
          
        </button>
      </div>

      {/* Comments Section */}
      {show && (
        <div className="absolute bottom-4 left-4 w-[90%] bg-black bg-opacity-75 rounded-lg p-4">
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-grow p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition duration-300"
            >
              Add
            </button>
          </form>
          <div className="mt-4 max-h-40 overflow-y-auto">
            {value.comments && value.comments.length > 0 ? (
              value.comments.map((e) => (
                <Comment key={e._id} value={e} user={user} owner={value.owner._id} id={value._id} />
              ))
            ) : (
              <p className="text-white">No comments yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCard;

export const Comment = ({ value, user, owner, id }) => {
  const { deleteComment } = PostData();
  const isCommentOwner = value.user._id === user._id;
  const isPostOwner = owner === user._id;

  const handleDeleteComment = () => {
    deleteComment(id, value._id);
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-gray-800 bg-opacity-75 rounded-md mb-2 relative">
      <Link to={`/user/${value.user._id}`}>
        <img
          src={value.user.profilePic.url}
          alt={`${value.user.name}'s profile`}
          className="w-10 h-10 rounded-full object-cover border-2 border-white"
        />
      </Link>
      <div>
        <Link to={`/user/${value.user._id}`}>
          <p className="font-medium text-white">{value.user.name}</p>
        </Link>
        <p className="text-gray-300 text-sm">{value.comment}</p>
      </div>

      {(isPostOwner || isCommentOwner) && (
        <button onClick={handleDeleteComment} className="ml-auto text-red-500">
          <MdDelete />
        </button>
      )}
    </div>
  );
};