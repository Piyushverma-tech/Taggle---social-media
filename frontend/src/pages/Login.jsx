import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/userContext";
import { PostData } from "../context/postContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const {loginUser, loading} = UserData();
  const {fetchPost} = PostData();

  const handleChange = (e) => {
    const { name, value, } = e.target;
      setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(formData.email, formData.password, navigate, fetchPost); 
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
  <>
  {
    loading? (<h1>Loading</h1>) : (<div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Sidebar */}
      <div className="flex flex-col items-center justify-center bg-indigo-600 text-white p-8 lg:w-1/3">
        <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
        <p className="text-center mb-6">
          Dont have an account? Sign up and explore the new world!
        </p>
        <Link to="/register">
          <button className="bg-white text-indigo-600 font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition duration-300">
           Sign up
          </button>
        </Link>
      </div>

      {/* Login Form */}
      <div className="w-full lg:w-2/3 flex items-center justify-center px-4  mt-12">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Login 
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">

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
                  type={showPassword ? "text" : "password"}
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
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>)
  }
  </>
  );
}

export default Login
