import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PostData } from "../context/postContext";
import PostCard from "../components/PostCard";
import axios from "axios";
import { Loading } from "../components/Loading";
import { UserData } from "../context/userContext";
import Modal from "../components/Modal";
import { SocketData } from "../context/socketContext";

const UserAccount = ({ user: loggedInUser }) => {
  const { posts, reels } = PostData();

  const [user, setUser] = useState({});
  const params = useParams();
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const { data } = await axios.get(`/api/user/${params.id}`);
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  // State for posts and reels visibility
  const [showPosts, setShowPosts] = useState(true);
  let myPosts = [];
  let myReels = [];

  if (posts) {
    myPosts = posts.filter((post) => post.owner._id === user._id);
  }

  if (reels) {
    myReels = reels.filter((reel) => reel.owner._id === user._id);
  }

  // Follow/unfollow functionality
  const [followed, setFollowed] = useState(false);
  const { followUser } = UserData();

  const handleFollow = () => {
    setFollowed(!followed);
    followUser(user._id, fetchUser);
  };

  const followers = user.followers || [];
  useEffect(() => {
    if (followers.includes(loggedInUser._id)) {
      setFollowed(true);
    }
  }, [user]);

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);

  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  async function followData() {
    if (!user._id) return;
    try {
      const { data } = await axios.get(`/api/user/followdata/${user._id}`);
      setFollowersData(data.followers);
      setFollowingsData(data.followings);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    followData();
  }, [user]);

  const { onlineUsers } = SocketData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {user && (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200">
              {show && (
                <Modal
                  value={followersData}
                  title={"Followers"}
                  setShow={setShow}
                />
              )}
              {show1 && (
                <Modal
                  value={followingsData}
                  title={"Followings"}
                  setShow={setShow1}
                />
              )}
              <div className="w-full max-w-md min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 rounded-xl shadow-lg p-6 relative">
                {user._id === loggedInUser._id && (
                  <Link to="/account">
                    <h1 className="font-semibold">Your Profile</h1>
                  </Link>
                )}

                {/* Profile Picture with Online Indicator */}
                <div className="relative">
                  <div className="flex justify-center relative">
                    <img
                      src={user.profilePic?.url || ""}
                      alt="Profile"
                      className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 hover:border-indigo-700 transition-all duration-300"
                    />
                  </div>
                  {/* Online Status Indicator */}
                  {onlineUsers.includes(user._id) && user._id !== loggedInUser._id ? (
                    <span className="absolute top-0 right-2 text-green-400 text-sm font-medium bg-white px-2 py-1 rounded-full shadow-sm">
                      Online
                    </span>
                  ) : ""}
                </div>

                {/* User Info */}
                <div className="text-center mt-4">
                  <h2 className="text-2xl font-semibold text-gray-800 mt-5 flex items-center justify-center gap-2">
                    {user.name}
                    <span className="text-sm px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                      {user.gender}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>

                {/* Followers and Following */}
                <div className="flex justify-around mt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-800">
                      {followers.length}
                    </h3>
                    <p
                      className="text-sm text-gray-600 cursor-pointer"
                      onClick={() => setShow(true)}
                    >
                      Followers
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-800">
                      {user.followings?.length || 0}
                    </h3>
                    <p
                      className="text-sm text-gray-600 cursor-pointer"
                      onClick={() => setShow1(true)}
                    >
                      Following
                    </p>
                  </div>
                </div>

                {user._id !== loggedInUser._id && (
                  <div className="flex items-center justify-center mt-4">
                    <button
                      onClick={handleFollow}
                      className={`px-5 py-1 rounded-md text-white ${
                        followed ? "bg-red-500" : "bg-blue-400"
                      }`}
                    >
                      {followed ? "Unfollow" : "Follow"}
                    </button>
                  </div>
                )}

                {/* Button to switch between Posts and Reels */}
                <div className="flex justify-center items-center gap-7 mt-6">
                  <button
                    onClick={() => setShowPosts(true)}
                    className={`${
                      showPosts ? "text-indigo-600" : "text-gray-500"
                    } font-semibold transition duration-300`}
                  >
                    Posts
                  </button>
                  <button
                    onClick={() => setShowPosts(false)}
                    className={`${
                      !showPosts ? "text-indigo-600" : "text-gray-500"
                    } font-semibold transition duration-300`}
                  >
                    Reels
                  </button>
                </div>

                {/* Show Posts or Reels */}
                <div className="mt-6">
                  {showPosts ? (
                    myPosts.length > 0 ? (
                      myPosts.map((post) => (
                        <PostCard value={post} key={post._id} type="post" />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center">No posts yet</p>
                    )
                  ) : myReels.length > 0 ? (
                    myReels.map((reel) => (
                      <PostCard value={reel} key={reel._id} type="reel" />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">No reels yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UserAccount;
