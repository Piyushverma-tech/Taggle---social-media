import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Page Under Development</h1>
      <p className="text-lg mb-6">We’re working hard to bring this page to life. Stay tuned!</p>
      <Link
        to="/"
        className="px-4 py-3 bg-teal-500 text-white font-medium rounded-lg shadow-md hover:bg-teal-600 transition duration-300"
      >
        Go to Home
      </Link>
    </div>
  );
}

export default NotFound;
