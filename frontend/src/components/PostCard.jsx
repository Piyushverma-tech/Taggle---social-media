import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { SocketData } from "../context/socketContext";

const PostCard = ({ type, value }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isCommented, setIsCommented] = useState(false);
  const [show, setShow] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [comment, setComment] = useState("");
  const { user } = UserData();
  const { likePost, addComment, deletePost, fetchPost } = PostData();

  const formatDate = format(new Date(value.createdAt), "MMMM do");

  useEffect(() => {
    // Check if the user's ID exists in the likes array
    if (value.likes.includes(user._id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }

    // Check if the user has commented on the post
    const userHasCommented = value.comments.some(
      (c) => c.user._id === user._id // Adjust to your comments data structure
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

  const { onlineUsers } = SocketData();

  return (
    <div className="max-w-2xl mx-auto bg-purple-50 bg-opacity-30 shadow-md rounded-lg overflow-hidden mb-6 mt-6">
      <EditModal isOpen={showModal} onClose={closeModal}>
        <div className="flex flex-col items-center justify-center gap-3  overflow-hidden">
          <button
            className="text-gray-800 font-medium  px-28 py-2 hover:bg-gray-100 transition duration-300"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className="text-gray-800 font-medium  px-28 py-2 hover:bg-gray-100 transition duration-300"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </EditModal>

      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link to={`/user/${value.owner._id}`}>
            <img
              src={value.owner.profilePic.url}
              alt={`${value.owner.name}'s profile`}
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>
          <div className="ml-3">
            <Link to={`/user/${value.owner._id}`}>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-800">
                  {value.owner.name}
                </p>
                {/* Online Status Indicator */}
                {onlineUsers.includes(value.owner._id) && (
                  <span className="w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                )}
              </div>
            </Link>
            <p className="text-sm text-gray-500">{formatDate}</p>
          </div>
        </div>
        {value.owner._id === user._id && (
          <button
            onClick={() => setShowModal(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <BsThreeDotsVertical size={25} />
          </button>
        )}
      </div>

      {/* Caption */}
      <div className="px-4 py-2">
        {showInput ? (
          <>
            <div className="flex items-center gap-3">
              <input
                className="flex-grow p-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                type="text"
                placeholder="Enter Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
              />
              <button
                className="bg-indigo-600 text-[0.8rem] text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                onClick={updateCaption}
                disabled={captionLoading}
              >
                {captionLoading ? <LoadingAnimation /> : " Update "}
              </button>
              <button
                onClick={() => setShowInput(false)}
                className="bg-gray-300 text-[0.8rem] text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-700 text-sm">{value.caption}</p>
        )}
      </div>

      {/* Content */}
      <div className="relative w-full h-full bg-gray-100 overflow-hidden">
        {type === "post" ? (
          <img
            src={value.post.url}
            alt="Post"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            autoPlay
            controls
            src={value.post.url}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Actions */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center ${
              isLiked ? "text-red-500" : "text-gray-500"
            }`}
          >
            <FaHeart className="mr-2" size={20} />
            <span>{value.likes.length} Likes</span>
          </button>

          <button
            onClick={() => setShow(!show)}
            className={`flex items-center ${
              isCommented ? "text-blue-500" : "text-gray-500"
            }`}
          >
            <FaComment className="mr-2" size={20} />
            <span>{value.comments.length} Comment</span>
          </button>

          <button
            onClick={() => setIsShared(!isShared)}
            className={`flex items-center ${
              isShared ? "text-green-500" : "text-gray-500"
            }`}
          >
            <FaShare className="mr-2" size={20} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {show && (
        <div className="p-4">
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
        </div>
      )}

      {/* Comments Section */}
      <hr className="mt-2 mb-2" />
      <p className="text-gray-800 font-semibold ml-2">Comments</p>
      <hr className="mt-2 mb-2" />
      <div className="mt-4">
        <div className="comments max-h-[200px] overflow-y-auto">
          {value.comments && value.comments.length > 0 ? (
            value.comments.map((e) => (
              <Comment
                key={e._id}
                value={e}
                user={user}
                owner={value.owner._id}
                id={value._id}
              />
            ))
          ) : (
            <p className="ml-2">No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;

export const Comment = ({ value, user, owner, id }) => {
  const { deleteComment } = PostData();
  const isCommentOwner = value.user._id === user._id;
  const isPostOwner = owner === user._id;

  const handleDeleteComment = () => {
    deleteComment(id, value._id);
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-purple-100 bg-opacity-30 rounded-md mb-2 relative">
      <Link to={`/user/${value.user._id}`}>
        <img
          src={value.user.profilePic.url}
          alt={`${value.user.name}'s profile`}
          className="w-10 h-10 rounded-full object-cover"
        />
      </Link>
      <div>
        <Link to={`/user/${value.user._id}`}>
          <p className="font-medium text-gray-800">{value.user.name}</p>
        </Link>
        <p className="text-gray-700 text-sm">{value.comment}</p>
      </div>

      {(isPostOwner || isCommentOwner) && (
        <button onClick={handleDeleteComment} className="ml-auto text-red-500">
          <MdDelete />
        </button>
      )}
    </div>
  );
};
