import { auth } from "../firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("UID: ", user.uid);

      navigate("/home"); // Redirect after successful login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Left Side with background image */}
      <div
        className="hidden md:flex w-full md:w-1/2 bg-cover bg-center relative shadow-inner-xl"
        style={{ backgroundImage: "url('/assets/images/LoginBackground.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-8">
          {/* Logo Image */}
          <img
            src="/assets/images/darkLogo.svg"
            alt="DIU Logo"
            className="w-20 h-20 mb-4"
          />
          <h2 className="text-3xl font-bold mb-2 text-center">
            Welcome to DIU Events
          </h2>
          <p className="text-lg text-center max-w-md">
            Your Gateway to Campus Life – Stay updated with all the latest
            university events!
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-6 text-center">
            Login
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm mb-2 text-center">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
              <div className="h-px flex-1 bg-gray-300 dark:bg-gray-600" />
              OR
              <div className="h-px flex-1 bg-gray-300 dark:bg-gray-600" />
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={() => alert("Google login triggered")}
              className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Sign up with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
