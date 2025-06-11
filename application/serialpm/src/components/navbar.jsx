import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import EnhancedSearchBar from "./searchBar";
import DatabaseSearch from "./search";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  User,
  Home,
  LayoutDashboard,
  Building2,
  LogIn,
  UserPlus,
  Calendar,
  Settings,
  HelpCircle,
  Star,
  DollarSign,
  Info,
  MessageSquare,
} from "lucide-react";
import NotificationSystem from "./NotificationSystem";
import MessagesModal from "./MessagesModal";
import { useTranslation } from 'react-i18next';
import '../i18n';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsSignedIn(!!token);
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      setIsSignedIn(!!token);
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

  const contentSections = [
    {
      id: "hero",
      title: t("navbarHeroTitle"),
      content: t("navbarHeroContent"),
    },
    {
      id: "overview",
      title: t("navbarOverviewTitle"),
      content: t("navbarOverviewContent"),
    },
    {
      id: "feature1",
      title: t("navbarFeature1Title"),
      content: t("navbarFeature1Content"),
      color: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
    },
    {
      id: "feature2",
      title: t("navbarFeature2Title"),
      content: t("navbarFeature2Content"),
      color: "bg-indigo-500/20",
      iconColor: "text-indigo-400",
    },
    {
      id: "feature3",
      title: t("navbarFeature3Title"),
      content: t("navbarFeature3Content"),
      color: "bg-pink-500/20",
      iconColor: "text-pink-400",
    },
    {
      id: "feature4",
      title: t("navbarFeature4Title"),
      content: t("navbarFeature4Content"),
      color: "bg-teal-500/20",
      iconColor: "text-teal-400",
    },
    {
      id: "testimonial1",
      title: t("navbarTestimonial1Title"),
      content: t("navbarTestimonial1Content"),
    },
    {
      id: "pricing",
      title: t("navbarPricingTitle"),
      content: t("navbarPricingContent"),
    },
  ];

  return (
    <nav
      className="fixed left-0 top-0 z-50 w-full border-b border-purple-800/30 bg-gradient-to-br from-purple-900/90 to-blue-900/90 shadow-lg backdrop-blur-md"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="text-shine-animation flex items-center text-2xl font-bold transition-transform duration-200 hover:scale-105">
          <Link to="/" aria-label="SerialPM Home" className="flex items-center">
            <svg
              className="mr-2 h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#logo-gradient)" />
              <path
                d="M2 17L12 22L22 17V7L12 12L2 7V17Z"
                fill="url(#logo-gradient-2)"
                opacity="0.8"
              />
              <defs>
                <linearGradient
                  id="logo-gradient"
                  x1="2"
                  y1="7"
                  x2="22"
                  y2="7"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#60A5FA" />
                  <stop offset="1" stopColor="#A78BFA" />
                </linearGradient>
                <linearGradient
                  id="logo-gradient-2"
                  x1="2"
                  y1="14.5"
                  x2="22"
                  y2="14.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#C4B5FD" />
                </linearGradient>
              </defs>
            </svg>
            {t('serialpm')}
          </Link>
          <style jsx>{`
            .text-shine-animation {
              background: linear-gradient(
                to right,
                #60a5fa 20%,
                #a78bfa 40%,
                #c4b5fd 60%,
                #3b82f6 80%
              );
              background-size: 200% auto;
              color: transparent;
              background-clip: text;
              -webkit-background-clip: text;
              animation: textShine 4s ease-in-out infinite;
            }

            @keyframes textShine {
              0% {
                background-position: 0% center;
              }
              50% {
                background-position: 100% center;
              }
              100% {
                background-position: 0% center;
              }
            }
          `}</style>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="mx-4 hidden max-w-md flex-1 md:block">
          {isDashboard ? (
            <DatabaseSearch />
          ) : (
            <EnhancedSearchBar contentSections={contentSections} />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-lg bg-purple-800/20 p-2 text-white transition-colors duration-200 hover:bg-purple-800/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-4 md:flex">
          {isSignedIn ? (
            <>
              <NavLink
                to="/dashboard"
                icon={<LayoutDashboard className="h-5 w-5" />}
                label={t('dashboard')}
                isActive={location.pathname === "/dashboard"}
              />
              <NavLink
                to="/organization"
                icon={<Building2 className="h-5 w-5" />}
                label={t('organization')}
                isActive={location.pathname === "/organization"}
              />
              <div className="flex items-center space-x-2">
                <NotificationSystem />
                <button
                  onClick={() => setIsMessagesOpen(true)}
                  className="flex items-center space-x-2 rounded-lg p-2 text-white transition-colors duration-200 hover:bg-purple-800/40"
                >
                  <MessageSquare className="h-6 w-6" />
                  <span className="hidden md:inline">{t('messages')}</span>
                </button>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 rounded-lg p-2 text-white transition-colors duration-200 hover:bg-purple-800/40"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden md:inline">{t('profile')}</span>
                </Link>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-6">
              <NavLink
                to="/#features"
                icon={<Star className="h-5 w-5" />}
                label={t('features')}
                isActive={location.pathname === "/#features"}
              />
              <NavLink
                to="/#pricing"
                icon={<DollarSign className="h-5 w-5" />}
                label={t('pricing')}
                isActive={location.pathname === "/#pricing"}
              />
              <NavLink
                to="/about"
                icon={<Info className="h-5 w-5" />}
                label={t('about')}
                isActive={location.pathname === "/about"}
              />
              <div className="flex items-center space-x-3">
                <Link to="/signin" className="w-full md:w-auto">
                  <button className="flex items-center space-x-2 rounded-lg border border-blue-400/80 px-4 py-2 text-blue-300 transition-all duration-200 hover:border-blue-500 hover:bg-blue-500/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
                    <LogIn className="h-5 w-5" />
                    <span>{t('signIn')}</span>
                  </button>
                </Link>
                <Link to="/signup" className="w-full md:w-auto">
                  <button className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-white shadow-lg shadow-purple-500/30 transition-all duration-200 hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50">
                    <UserPlus className="h-5 w-5" />
                    <span>{t('getStarted')}</span>
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="space-y-1 bg-gradient-to-b from-purple-900/95 to-blue-900/95 px-2 pb-3 pt-2 backdrop-blur-lg">
              {/* Mobile Search Bar */}
              <div className="mb-4 px-2">
                {isDashboard ? (
                  <DatabaseSearch />
                ) : (
                  <EnhancedSearchBar contentSections={contentSections} />
                )}
              </div>

              {isSignedIn ? (
                <>
                  {/* Mobile Notifications */}
                  <div className="mb-4 px-2">
                    <div className="flex items-center justify-between rounded-lg bg-purple-800/20 p-2">
                      <span className="text-white">{t('notifications')}</span>
                      <NotificationSystem />
                    </div>
                  </div>

                  <MobileNavLink
                    to="/dashboard"
                    icon={<LayoutDashboard className="h-5 w-5" />}
                    label={t('dashboard')}
                    isActive={location.pathname === "/dashboard"}
                    onClick={() => setIsOpen(false)}
                  />
                  <MobileNavLink
                    to="/organization"
                    icon={<Building2 className="h-5 w-5" />}
                    label={t('organization')}
                    isActive={location.pathname === "/organization"}
                    onClick={() => setIsOpen(false)}
                  />
                  <MobileNavLink
                    to="/profile"
                    icon={<User className="h-5 w-5" />}
                    label="Profile"
                    isActive={location.pathname === "/profile"}
                    onClick={() => setIsOpen(false)}
                  />
                  <MobileNavLink
                    onClick={() => {
                      setIsMessagesOpen(true);
                      setIsOpen(false);
                    }}
                    icon={<MessageSquare className="h-5 w-5" />}
                    label={t('messages')}
                  />
                </>
              ) : (
                <>
                  <MobileNavLink
                    to="/#features"
                    icon={<Star className="h-5 w-5" />}
                    label={t('features')}
                    isActive={location.pathname === "/#features"}
                    onClick={() => setIsOpen(false)}
                  />
                  <MobileNavLink
                    to="/#pricing"
                    icon={<DollarSign className="h-5 w-5" />}
                    label={t('pricing')}
                    isActive={location.pathname === "/#pricing"}
                    onClick={() => setIsOpen(false)}
                  />
                  <MobileNavLink
                    to="/about"
                    icon={<Info className="h-5 w-5" />}
                    label={t('about')}
                    isActive={location.pathname === "/about"}
                    onClick={() => setIsOpen(false)}
                  />
                  <div className="mt-4 space-y-2 px-2">
                    <Link to="/signin" className="block w-full">
                      <button className="flex w-full items-center justify-center space-x-2 rounded-lg border border-blue-400/80 px-4 py-2 text-blue-300 transition-all duration-200 hover:border-blue-500 hover:bg-blue-500/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
                        <LogIn className="h-5 w-5" />
                        <span>{t('signIn')}</span>
                      </button>
                    </Link>
                    <Link to="/signup" className="block w-full">
                      <button className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-white shadow-lg shadow-purple-500/30 transition-all duration-200 hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50">
                        <UserPlus className="h-5 w-5" />
                        <span>{t('getStarted')}</span>
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Modal */}
      <MessagesModal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
      />
    </nav>
  );
};

// Desktop NavLink Component
const NavLink = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={`group relative flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive
      ? "bg-purple-800/40 text-white"
      : "text-white/90 hover:bg-purple-800/40 hover:text-white"
      }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

// Mobile NavLink Component
const MobileNavLink = ({ to, icon, label, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-base font-medium transition-colors duration-200 ${isActive
      ? "bg-purple-800/40 text-white"
      : "text-white/90 hover:bg-purple-800/40 hover:text-white"
      }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default Navbar;
