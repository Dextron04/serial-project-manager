import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/LanguageSelector"; // adjust path if needed



const API_URL = import.meta.env.VITE_BACKEND_FETCH_URL;

const login = (token) => {
  localStorage.setItem("token", token);
  window.dispatchEvent(new Event("authChange"));
};

const SignUp = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);

  const toggleTermsModal = () => setShowTermsModal((prev) => !prev);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateInputs = () => {
    const { name, email, password, confirmPassword } = formData;

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("All fields are required");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
      toast.error("Password must contain at least one special character");
      return false;
    }

    const numberRegex = /[0-9]/;
    if (!numberRegex.test(password)) {
      toast.error("Password must contain at least one number");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (!formData.agreeToTerms) {
      toast.error("You must agree to the Terms & Conditions");
      return false;
    }

    const toggleTermsModal = () => setShowTermsModal(!showTermsModal);

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        toast.success("User signed up successfully!");

        // Store user details and token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("authChange"));

        setTimeout(() => navigate("/profile"), 1000);
      } else {
        const error = await response.json();
        toast.error(error.error || "Signup failed");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("An error occurred while signing up. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="w-full max-w-md rounded-xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg">
        <h2 className="mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-center text-3xl font-bold text-transparent">
        {t("signUpTitle")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">
            {t("signUpNameLabel")}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 p-3 text-white placeholder-white/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              placeholder={t("signUpNamePlaceholder")}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">
              {t("signUpEmailLabel")}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 p-3 text-white placeholder-white/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              placeholder={t("signUpEmailPlaceholder")}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">
            {t("signUpPasswordLabel")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 p-3 text-white placeholder-white/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                placeholder={t("signUpPasswordPlaceholder")}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-white/40"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">
            {t("signUpConfirmPasswordLabel")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 p-3 text-white placeholder-white/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                placeholder={t("signUpPasswordPlaceholder")}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-white/40"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 py-3 font-semibold text-white transition-all duration-300 hover:from-purple-700 hover:to-blue-700"
            disabled={loading}
          >
            {loading ? t("signUpLoading") : t("signUpButton")}
          </button>
        </form>
        <div className="mt-6 space-y-4 text-center">
          <Link
            to="/dashboard"
            className="text-sm text-white/80 underline hover:text-white"
          >
            {t("signUpGuestLink")}
          </Link>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="h-4 w-4 rounded border-white/20 bg-white/5 text-purple-400 focus:ring-purple-400"
            required
          />
          <label className="text-sm text-white/80">
          {t("signUpAgreeToTerms")}{" "}
            <button
              type="button"
              onClick={toggleTermsModal}
              className="underline hover:text-white"
            >
              {t("signUpTermsButton")}
            </button>
          </label>
        </div>
      </div>

      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="max-w-lg rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-gray-800">
              {t("signUpTermsTitle")}
              </h3>
              <div className="max-h-64 overflow-y-auto text-sm text-gray-700">
                <p>
                {t("signUpTermsBody")}
                </p>
              </div>
              <div className="mt-6 text-right">
                <button
                  onClick={toggleTermsModal}
                  className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                >
                  {t("signUpCloseButton")}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mt-6 text center">
          <LanguageSelector />
      </div>
    </div>
  );
};

export default SignUp;
