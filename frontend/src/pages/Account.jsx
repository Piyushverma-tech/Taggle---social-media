import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/userContext";
import { PostData } from "../context/postContext";
import { Loading } from "../components/Loading";
import PostCard from "../components/PostCard";
import Modal from "../components/Modal";
import { FiSettings } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import axios from "axios";
import toast from "react-hot-toast";
import VideoCard from "../components/VideoCard";

const Account = ({ user }) => {
  const navigate = useNavigate();
  const { logOutUser, updateProfilePic, updateProfileName } = UserData();
  const { posts, reels, loading } = PostData();

  const [showPosts, setShowPosts] = useState(true);

  let myPosts = [];
  let myReels = [];

  if (posts) {
    myPosts = posts.filter((post) => post.owner._id === user._id);
  }

  if (reels) {
    myReels = reels.filter((reel) => reel.owner._id === user._id);
  }

  const handleLogout = () => {
    logOutUser(navigate);
  };

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);

  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  async function followData() {
    try {
      const { data } = await axios.get("/api/user/followdata/" + user._id);
      setFollowersData(data.followers);
      setFollowingsData(data.followings);
    } catch (error) {
      console.log(error);
    }
  }

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const previewURL = URL.createObjectURL(selectedFile);
      setPreview(previewURL);
    } else {
      setPreview(null);
    }
  };

  const handleImgChange = () => {
    if (!file) {
      toast.error("Please upload an image to update.");
      return;
    }
    const formdata = new FormData();
    formdata.append("file", file);
    updateProfilePic(user._id, formdata, setFile, setShowSettingsModal);
    setPreview(null); // Clear the preview after updating
  };

  useEffect(() => {
    followData();
  }, [user]);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [name, setName] = useState(user.name ? user.name : "");

  const updateName = () => {
    updateProfileName(user._id, name, setName, setShowSettingsModal);
  };

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [currentPassword, setcurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function updatePassword(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/user/${user._id}`, {
        currentPassword,
        newPassword,
      });
      toast.success(data.message);
      setcurrentPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        user && (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200 ">
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
            {/* Settings Modal */}
            {showSettingsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-gradient-to-r from-blue-100 to-purple-200  max-w-sm p-8 rounded-lg shadow-xl relative">
                  {/* Close Button */}
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-semibold"
                    onClick={() => setShowSettingsModal(false)}
                  >
                    &times;
                  </button>

                  {/* Modal Title */}
                  <h2 className="text-2xl font-semibold text-gray-800 text-center mb-10">
                    Settings
                  </h2>
                  {/* Update Profile Picture */}
                  <div className="mb-4">
                    <label className="block font-medium text-gray-700 mb-2 text-sm">
                      Update Profile Picture
                    </label>
                    <div className="flex flex-col items-center gap-4">
                      {preview && (
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-full border"
                        />
                      )}
                      <div className="flex items-center gap-4 w-full">
                        <label className="flex flex-1 items-center justify-center px-3 py-2 bg-white border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-300 transition">
                          <span className="flex items-center gap-2 text-gray-700 text-sm">
                            Upload Image <LuUpload />
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            required
                          />
                        </label>
                        <button
                          onClick={handleImgChange}
                          className="px-4 py-2 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Edit Name */}
                  <div className="mb-10">
                    <label
                      htmlFor="name"
                      className="block font-medium text-gray-700 mb-2 text-sm"
                    >
                      Update Name
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        id="name"
                        type="text"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-gray-500 transition"
                      />
                      <button
                        onClick={updateName}
                        className="px-4 py-2 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition"
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  {/* Update Password */}
                  <form onSubmit={updatePassword} className="mb-8">
                    <label
                      htmlFor="Password"
                      className="block font-medium text-gray-700 mb-2 text-sm"
                    >
                      Update Password
                    </label>
                    <div className="flex flex-col gap-4">
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Old Password"
                          value={currentPassword}
                          onChange={(e) => setcurrentPassword(e.target.value)}
                          required
                          className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-gray-500 transition"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                        >
                          {showCurrentPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-gray-500 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="mt-4 w-full px-4 py-2 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition"
                    >
                      Update Password
                    </button>
                  </form>

                

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            <div className="w-full max-w-md min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 rounded-xl shadow-lg p-6 relative">
              {/* Settings Icon */}
              <button
                onClick={() => setShowSettingsModal(true)}
                className="absolute top-4 right-4 text-gray-800 text-2xl hover:text-indigo-700 transition duration-300"
              >
                <FiSettings />
              </button>

              {/* Profile Picture */}
              <div className="flex justify-center">
                <img
                  src={user.profilePic.url}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 hover:border-indigo-700 transition-all duration-300"
                />
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
                    {user.followers.length}
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
                    {user.followings.length}
                  </h3>
                  <p
                    className="text-sm text-gray-600 cursor-pointer"
                    onClick={() => setShow1(true)}
                  >
                    Following
                  </p>
                </div>
              </div>

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
                    <VideoCard value={reel} key={reel._id} type="reel" />
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No reels yet</p>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Account;
