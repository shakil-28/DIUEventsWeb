import React from 'react';

export default function Login() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side with background image */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/diu-login.png')" }} // ✅ Make sure this image is in public/images
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-8">
          <h2 className="text-3xl font-bold mb-2 text-center">Welcome to DIU Events</h2>
          <p className="text-lg text-center max-w-md">
            Your Gateway to Campus Life – Stay updated with all the latest university events!
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Login</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email "
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="text-right">
              {/* <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a> */}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>

            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <div className="h-px flex-1 bg-gray-300" />
              OR
              <div className="h-px flex-1 bg-gray-300" />
            </div>

            <button
              type="button"
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 transition flex items-center justify-center gap-2"
              onClick={() => alert('Google login triggered')}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Login with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
