import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserData } from '../context/userContext';
import { PostData } from '../context/postContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    file: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);

  const { registerUser, loading } = UserData();

  const { fetchPost } = PostData();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      const file = files[0];
      setFormData({ ...formData, file });
      setPreview(file ? URL.createObjectURL(file) : null); // Set preview URL
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formdata = new FormData();

    formdata.append('name', formData.name);
    formdata.append('email', formData.email);
    formdata.append('password', formData.password);
    formdata.append('gender', formData.gender);
    formdata.append('file', formData.file);

    registerUser(formdata, navigate, fetchPost);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const RecruiterMessage = () => (
    <div className="absolute top-6 z-10 p-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md">
      <div className="text-base text-gray-600 mb-2">Recruiter/Tester?</div>
      <div className="text-sm text-gray-800 mb-2">
        Skip signup - use demo account instead
      </div>
      <Link
        to="/login"
        className="inline-block text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
      >
        Go to Sign In →
      </Link>
    </div>
  );

  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
          {/* Sidebar */}
          <div className="flex flex-col items-center justify-center bg-indigo-600 text-white p-8 lg:w-1/3">
            <RecruiterMessage />
            <h2 className="text-3xl font-bold mb-4">Welcome to Taggle!</h2>
            <p className="text-center mb-6">
              Already have an account? Log in to stay connected with your
              friends!
            </p>
            <Link to="/login">
              <button className="bg-white text-indigo-600 font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition duration-300">
                Log in
              </button>
            </Link>
          </div>

          {/* Registration Form */}
          <div className="w-full lg:w-2/3 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Create an Account
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture Preview */}
                <div className="flex flex-col items-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile Preview"
                      className="w-28 h-28 rounded-full mb-4 object-cover"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                      <span className="text-gray-500 text-sm text-center">
                        Upload profile picture
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    id="profilePicture"
                    name="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-50 hover:file:bg-gray-100"
                  />
                </div>

                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="johndoe@example.com"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 bg-gray-50 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Gender Field */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                >
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
