import React, { useState } from "react";
import AddPost from "../components/AddPost";
import VideoCard from "../components/VideoCard";
import { PostData } from "../context/postContext";
import { Loading } from "../components/Loading";
import { FiPlus } from "react-icons/fi";

function Reels() {
  const { reels, loading } = PostData();

  const [showModal, setShowModal] = useState(false);

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };


  return (
    <>
    { 
      loading? <Loading/> : <div className=" bg-gradient-to-r from-blue-100 to-purple-200"> 
      <div className="ml-auto mr-auto w-full min-h-screen max-w-md bg-gradient-to-r from-blue-100 to-purple-200 rounded-xl shadow-lg py-6">
      {/* Add Reel Section */}
      {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-gradient-to-r from-blue-100 to-purple-200 rounded-xl shadow-lg w-[400px] max-w-sm relative">
                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-semibold"
                  onClick={handleModalToggle}
                >
                  &times;
                </button>
                {/* Add Post Component */}
                <AddPost type="reel" setShowModal={setShowModal}/>
              </div>
            </div>
          )}

       {/* Posts Section */}
       <div >
            {reels && reels.length > 0 ? (
              reels.map((e) => (
                <VideoCard value={e} key={e._id} type="reel" />
              ))
            ) : (
              ""
            )}
          </div>
         {/* Add reel Button */}
          <button
            onClick={handleModalToggle}
            className="fixed top-6 right-6 bg-indigo-500 text-white p-4 rounded-full shadow-lg hover:bg-indigo-600 transition z-40"
            aria-label="Add reel"
          >
            <FiPlus size={24} />
          </button>
    </div>
    </div>
    }
    </>
  );
}

export default Reels;
