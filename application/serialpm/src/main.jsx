import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import About from "./pages/About/About";
import LandingPage from "./pages/landing/page";
import Project from "./pages/Project/project";
import Navbar from "./components/navbar";
import Signin from "./pages/Signin/Signin";
import SignUp from "./pages/Signup/Signup";
import Dashboard from "./pages/dashboard/dashboard";
import Profile from "./pages/profile/profile";
import Organization from "./pages/Organization/Organization";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TeamManagement from "./pages/TeamManagement/TeamManagement";
import Footer from "./components/Footer";

const container = document.getElementById("root");
const root = createRoot(container);

function Main() {
  return (
    <div className="Main">
      <Navbar />
      <div className="Content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/About" element={<About />} />
          <Route path="/project/:projectId" element={<Project />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/organization" element={<Organization />} />
          <Route path="/team-management" element={<TeamManagement />} />
        </Routes>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

root.render(
  <React.StrictMode>
    <Router>
      <Main />
    </Router>
  </React.StrictMode>
);
