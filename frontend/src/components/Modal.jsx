import React from "react";
import { Link } from "react-router-dom";

const Modal = ({ value, title, setShow }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      {/* Modal container */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-200 rounded-lg p-6 shadow-lg w-[90%] max-w-md max-h-[90%] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h1 className="text-xl font-semibold text-blue-600">{title}</h1>
          <button
            onClick={() => setShow(false)}
            className="text-gray-500 text-2xl font-bold hover:text-gray-700 transition duration-300"
          >
            &times;
          </button>
        </div>

        {/* User List */}
        <div>
          {value && value.length > 0 ? (
            value.map((e) => (
              <Link
                key={e._id}
                onClick={() => setShow(false)}
                to={`/user/${e._id}`}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition duration-300"
              >
                <img
                  src={e.profilePic.url}
                  alt={e.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{e.name}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No {title} to display</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
