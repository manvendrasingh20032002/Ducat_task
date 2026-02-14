import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { toast } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      await login({ email, password });
    } catch (err) {
      // Error toast already handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col gap-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Welcome Back
        </h2>
        
        <p className="text-center text-gray-500 mb-8">
          Login to your account to continue
        </p>

        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-700 font-medium">Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-gray-700 font-medium">Password: </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="border-2 border-gray-300 rounded-xl px-4 py-3 pr-12 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[42px] text-gray-500 cursor-pointer select-none text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className=""
        >
          Login
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <span
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}