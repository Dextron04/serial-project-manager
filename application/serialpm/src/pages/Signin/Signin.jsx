import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; // Import Link for routing
import { toast } from "react-toastify";
import LanguageSelector from "../../components/LanguageSelector"; 
import { useTranslation } from "react-i18next";




const API_URL = import.meta.env.VITE_BACKEND_FETCH_URL;

const login = (token) => {
  localStorage.setItem("token", token);
  window.dispatchEvent(new Event("authChange"));
};

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message state
  const [showPassword, setShowPassword] = useState(false); // Password visibility state
  const navigate = useNavigate();
  const { t } = useTranslation();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in both fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success("Signed in successfully!");

        // Store user details and token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("authChange"));

        navigate("/profile");
      } else {
        toast.error(data.error || "Invalid email or password.");
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="flex grow items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md rounded-xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg"
      >
        <h2 className="mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-center text-3xl font-bold text-transparent">
        {t("signInWelcomeBack")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-white/80">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 p-3 text-white placeholder-white/40 transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-white/80">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 p-3 text-white placeholder-white/40 transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-white/60"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && <div className="text-sm text-red-500">{error}</div>}

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(147, 51, 234, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 py-3 font-semibold text-white transition-all duration-300 hover:from-purple-700 hover:to-blue-700"
          >
            {loading ? (
              <span className="relative z-10">{t("signInLoading")}</span>
            ) : (
              <span className="relative z-10">{t("signInButton")}</span>
            )}
            <div className="animate-shine absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </motion.button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-white/60">
          {t("signInNoAccount")}{" "}
            <Link
              to="/signup"
              className="text-purple-300 transition-colors duration-200 hover:text-purple-200"
            >
              {t("signInSignUpLink")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>

     {/* ✅ Language Selector goes here */}
     <div className="mt-6 text-center">
     <LanguageSelector />
   </div>
   </div>
  );
};

export default SignIn;
