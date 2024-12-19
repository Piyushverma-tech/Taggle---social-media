import React, { useState } from "react";
import { PostData } from "../context/postContext";
import { LoadingAnimation } from "./Loading";

function AddPost({ type, setShowModal }) {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const {addPost, addLoading} = PostData();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handlePostUpload = () => {
    if (!file) {
      alert("Please upload a file.");
      return;
    }
    
      const formdata = new FormData();
      formdata.append("caption", caption);
      formdata.append("file", file);
    
        addPost(formdata, setCaption, setFile, setPreview, type, setShowModal); 
     
  };

  return (
    <div className=" p-5 rounded-lg max-w-md mx-auto mt-8">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Create a New {type === "post" ? "Post" : "Reel"}
      </h2>

      {/* Caption Input */}
      <textarea
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full p-3  bg-slate-500 bg-opacity-30 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-4"
        rows="3"
      />

      {/* Upload Section */}
      {!preview ? (
        <div className="flex justify-center ">
          <label
            className="flex items-center justify-center w-full max-w-md h-10 mb-5 bg-slate-400 bg-opacity-30 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-200 transition"
          >
            <span className="text-black text-sm ">
              Upload {type === "post" ? "an image" : "a video"}
            </span>
            <input
              type="file"
              accept={type === "post" ? "image/*" : "video/*"}
              onChange={handleFileChange}
              className="hidden"
              required
            />
          </label>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center mb-4">
          <div
            className="relative bg-black rounded-md overflow-hidden" // 4:5 ratio container
          >
            {type === "post" ? (
              <img
                src={preview}
                alt="Post Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                controls
                src={preview}
                className="w-[300px] h-[450px] object-cover"
                controlsList="nodownload"
                required
              />
            )}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        disabled={addLoading}
        onClick={handlePostUpload}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
      >
        {addLoading? <LoadingAnimation/> : `Add ${type === "post" ? "Post" : "Reel"}`}
      </button>
    </div>
  );
}

export default AddPost