import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Star,
  ArrowRight,
  Users,
  Calendar,
  Clock,
  Github,
  ChevronDown,
} from "lucide-react";
import PricingSection from "../../components/pricing";
import { FaGoogle, FaApple } from "react-icons/fa";
import { SiZoom } from "react-icons/si";
import Footer from "../../components/Footer";
import { useTranslation } from 'react-i18next';
import '../../i18n';


export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contentRef = useRef(null);
  const { t, i18n } = useTranslation();


  // Handle scroll animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager at TechCorp",
      company: "TechCorp",
      quote:
        "Serial PM has transformed how our team works. We've reduced meeting time by 40% and increased our delivery speed by 35%.",
      avatar: "https://placehold.co/64x64",
      logo: "https://placehold.co/32x32",
    },
    {
      name: "Michael Chen",
      role: "CTO at Innovate Labs",
      company: "Innovate Labs",
      quote:
        "I've used many project management tools, but Serial PM is the first one that actually adapts to our workflow instead of forcing us to change.",
      avatar: "https://placehold.co/64x64",
      logo: "https://placehold.co/32x32",
    },
    {
      name: "Elena Rodriguez",
      role: "Lead Developer at BuildFast",
      company: "BuildFast",
      quote:
        "The GitHub integration and automatic task prioritization have been game-changers for our development process.",
      avatar: "https://placehold.co/64x64",
      logo: "https://placehold.co/32x32",
    },
  ];

  const useCase = [
    {
      title: t('productTeamsTitle'),
      description: t('productTeamsDescription'),
      features: [
        {
          title: t('automaticSprintPlanningTitle'),
          description: t('automaticSprintPlanningDescription'),
        },
        {
          title: t('visualProjectTimelineTitle'),
          description: t('visualProjectTimelineDescription'),
        },
        {
          title: t('featureProgressTrackingTitle'),
          description: t('featureProgressTrackingDescription'),
        },
      ],
      image: "https://placehold.co/600x400",
    },
    {
      title: t('engineeringTeamsTitle'),
      description: t('engineeringTeamsDescription'),
      features: [
        {
          title: t('directGithubIntegrationTitle'),
          description: t('directGithubIntegrationDescription'),
        },
        {
          title: t('automatedTaskAssignmentTitle'),
          description: t('automatedTaskAssignmentDescription'),
        },
        {
          title: t('intelligentEstimationTitle'),
          description: t('intelligentEstimationDescription'),
        },
      ],
      image: "https://placehold.co/600x400",
    },
    {
      title: t('marketingTeamsTitle'),
      description: t('marketingTeamsDescription'),
      features: [
        {
          title: t('campaignTimelineVisualizationTitle'),
          description: t('campaignTimelineVisualizationDescription'),
        },
        {
          title: t('contentCalendarTitle'),
          description: t('contentCalendarDescription'),
        },
        {
          title: t('performanceTrackingIntegrationTitle'),
          description: t('performanceTrackingIntegrationDescription'),
        },
      ],
      image: "https://placehold.co/600x400",
    },
  ];

  const features = [
    {
      id: "feature1",
      title: t('feature1Title'),
      content: t('feature1Content'),
      color: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
      icon: Users,
    },
    {
      id: "feature2",
      title: t('feature2Title'),
      content: t('feature2Content'),
      color: "bg-indigo-500/20",
      iconColor: "text-indigo-400",
      icon: Github,
    },
    {
      id: "feature3",
      title: t('feature3Title'),
      content: t('feature3Content'),
      color: "bg-pink-500/20",
      iconColor: "text-pink-400",
      icon: Clock,
    },
    {
      id: "feature4",
      title: t('feature4Title'),
      content: t('feature4Content'),
      color: "bg-teal-500/20",
      iconColor: "text-teal-400",
      icon: Calendar,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      <div ref={contentRef} className="relative z-10">
        {/* Hero Section with CTA */}
        <section
          ref={heroRef}
          id="hero"
          className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 text-center"
        >
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
            {t('projectManagement')} {" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {t('reimagined')}
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-300 md:text-2xl">
            {t('welcome')}
          </p>

          <div className="mb-16 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <a
              className="group flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-medium text-white transition-all hover:from-blue-600 hover:to-purple-700"
              title="This website is still in development and this will be updated soon."
              style={{ cursor: "not-allowed" }}
            >
              {t('startFreeTrial')}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#"
              className="flex items-center justify-center rounded-lg bg-gray-800/50 px-8 py-4 text-lg font-medium text-white backdrop-blur-sm hover:bg-gray-700/50"
              onClick={() => setIsVideoPlaying(true)}
            >
              {t('watchDemo')}
            </a>
          </div>

          {/* Scroll indicator */}
        </section>

        {/* Key Value Proposition */}
        <section className="bg-gradient-to-b from-transparent to-gray-900/50 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <span className="mb-4 inline-block rounded-full bg-pink-900/50 px-4 py-1 text-sm font-medium text-pink-400">
                {t('whySerialPM')}
              </span>
              <h3 className="mb-4 text-4xl font-bold md:text-5xl">
                {t('whyTeamsChooseSerialPM')}
              </h3>
              <p className="mx-auto max-w-2xl text-xl text-gray-300">
                {t('serialPMDesignedForTeams')}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20">
                  <Clock className="h-8 w-8 text-blue-400" />
                </div>
                <h4 className="mb-2 text-xl font-bold">
                  {t('saveTimeTitle')}
                </h4>
                <p className="text-gray-300">
                  {t('saveTimeDesc')}
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600/20">
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
                <h4 className="mb-2 text-xl font-bold">
                  {t('boostCollaborationTitle')}
                </h4>
                <p className="text-gray-300">
                  {t('boostCollaborationDesc')}
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-600/20">
                  <Calendar className="h-8 w-8 text-pink-400" />
                </div>
                <h4 className="mb-2 text-xl font-bold">
                  {t('stayOnTrackTitle')}
                </h4>
                <p className="text-gray-300">
                  {t('stayOnTrackDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Overview with Screenshot */}
        <section id="overview" className="container mx-auto px-4 py-20">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <span className="mb-4 inline-block rounded-full bg-blue-900/50 px-4 py-1 text-sm font-medium text-blue-400">
                {t('intelligentAutomation')}
              </span>
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                {t('builtForTeams')} <span className="text-blue-400">{t('actuallyWork')}</span>
              </h2>
              <p className="mb-8 text-xl text-gray-300">
                {t('serialPMActiveManagement')}
              </p>

              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">
                      {t('selfUpdatingTimelinesTitle')}
                    </h4>
                    <p className="text-gray-300">
                      {t('selfUpdatingTimelinesDesc')}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">
                      {t('smartWorkloadBalancingTitle')}
                    </h4>
                    <p className="text-gray-300">
                      {t('smartWorkloadBalancingDesc')}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">
                      {t('crossTeamVisibilityTitle')}
                    </h4>
                    <p className="text-gray-300">
                      {t('crossTeamVisibilityDesc')}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative">
              {/* Glowing effect behind image */}
              <div className="absolute -top-10 left-10 h-72 w-72 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-10 right-10 h-72 w-72 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>

              {/* Screenshot */}
              <div className="relative rounded-xl border border-gray-700 bg-gray-800/30 p-2 shadow-2xl backdrop-blur-sm">
                <img
                  src="/project_line.png"
                  alt="Serial PM Dashboard"
                  className="rounded-lg shadow-lg"
                />

                {/* Floating elements */}
                <div className="absolute -right-4 -top-4 rounded-lg bg-gray-800 p-4 shadow-lg">
                  <div className="mb-2 h-2 w-20 rounded-full bg-green-400"></div>
                  <div className="h-2 w-16 rounded-full bg-gray-600"></div>
                </div>

                <div className="absolute -bottom-6 -left-6 rounded-lg bg-gray-800 p-4 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-purple-400"></div>
                    <div className="h-2 w-16 rounded-full bg-gray-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          ref={featuresRef}
          id="features"
          className="bg-gradient-to-b from-gray-900/0 to-gray-900/50 py-24"
        >
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <span className="mb-4 inline-block rounded-full bg-purple-900/50 px-4 py-1 text-sm font-medium text-purple-400">
                KEY FEATURES
              </span>
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                Why Teams Choose Serial PM
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-gray-300">
                We've reimagined project management from the ground up to solve
                the challenges modern teams face.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className="group rounded-xl border border-gray-700 bg-gray-800/30 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/20"
                  >
                    {/* Circle Icon Wrapper */}
                    <div
                      className={`mb-6 flex h-14 w-14 items-center justify-center rounded-full ${feature.color} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className={`h-7 w-7 ${feature.iconColor}`} />
                    </div>

                    <h3 className="mb-3 text-2xl font-bold">{feature.title}</h3>
                    <p className="text-gray-300">{feature.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Use Cases/Team Tabs Section */}
        <section id="use-cases" className="container mx-auto px-4 py-24">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-yellow-900/50 px-4 py-1 text-sm font-medium text-yellow-400">
              {t('flexibleForEveryTeam')}
            </span>
            <h3 className="mb-4 text-4xl font-bold md:text-5xl">
              {t('builtForEveryTeam')}
            </h3>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              {t('serialPMAdaptsToWorkflow')}
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-12 flex flex-wrap justify-center gap-4">
            {useCase.map((tab, idx) => (
              <button
                key={tab.title}
                className={`rounded-full px-6 py-2 text-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeTab === idx
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-blue-900/40"
                  }`}
                onClick={() => setActiveTab(idx)}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <ul className="space-y-4">
                {useCase[activeTab].features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                      <CheckCircle className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{feature.title}</h4>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <a
                className="mt-8 inline-flex items-center rounded-md border border-blue-500 px-6 py-3 font-medium text-blue-400 hover:bg-blue-900/20"
                title="This website is still in development and this will be updated soon."
                style={{ cursor: "not-allowed" }}
              >
                {t('learnMoreAbout', { team: useCase[activeTab].title })}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>

            <div className="relative">
              <img
                src={useCase[activeTab].image}
                alt={useCase[activeTab].title}
                className="rounded-xl border border-gray-700 bg-gray-800/30 p-2 shadow-2xl backdrop-blur-sm"
              />
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-green-900/50 px-4 py-1 text-sm font-medium text-green-400">
              {t('seamlessIntegration')}
            </span>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              {t('worksWithYourTools')}
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              {t('serialPMConnectsWithTools')}
            </p>
          </div>

          <div className="grid grid-cols-2 justify-items-center gap-8 md:grid-cols-4">
            {/* GitHub */}
            <div className="flex flex-col items-center">
              <Github className="mb-2 h-12 w-12 text-white" />
              <span className="text-lg font-medium text-gray-200">GitHub</span>
            </div>
            {/* Google Calendar */}
            <div className="flex flex-col items-center">
              <FaGoogle className="mb-2 h-12 w-12 text-[#4285F4]" />
              <span className="text-lg font-medium text-gray-200">
                Google Calendar
              </span>
            </div>
            {/* Apple Calendar */}
            <div className="flex flex-col items-center">
              <FaApple className="mb-2 h-12 w-12 text-[#FA243C]" />
              <span className="text-lg font-medium text-gray-200">
                Apple Calendar
              </span>
            </div>
            {/* Zoom */}
            <div className="flex flex-col items-center">
              <SiZoom className="mb-2 h-12 w-12 text-[#2D8CFF]" />
              <span className="text-lg font-medium text-gray-200">Zoom</span>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-gradient-to-b from-gray-900/0 to-gray-900/50 py-24">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <span className="mb-4 inline-block rounded-full bg-orange-900/50 px-4 py-1 text-sm font-medium text-orange-400">
                {t('howItWorks')}
              </span>
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                {t('getStartedInMinutes')}
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-gray-300">
                {t('serialPMGetsTeamRunning')}
              </p>
            </div>

            <div className="relative">
              {/* Timeline Connector */}
              <div className="absolute left-1/2 top-0 z-0 -ml-px h-full w-px bg-gradient-to-b from-blue-500 to-purple-500"></div>

              <div className="relative z-10 flex flex-col gap-24">
                {/* Step 1 */}
                <div className="flex flex-col items-center gap-8 md:flex-row md:items-stretch md:gap-0">
                  {/* Step marker */}
                  <div className="flex flex-col items-center pr-0 md:w-1/2 md:items-end md:pr-12">
                    <div className="mb-4 flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-blue-900 bg-blue-500 text-lg font-bold text-white shadow-lg">
                        1
                      </div>
                      <span className="ml-3 text-lg font-semibold text-blue-400">
                        Step 1
                      </span>
                    </div>
                    <div className="text-right md:text-right">
                      <h3 className="mb-2 text-2xl font-bold">
                        {t('howItWorksStep1Title')}
                      </h3>
                      <p className="mb-2 text-gray-300">
                        {t('howItWorksStep1Description')}
                      </p>
                      <p className="text-gray-400">{t('howItWorksStep1Time')}</p>
                    </div>
                  </div>
                  {/* Image */}
                  <div className="flex flex-1 items-center justify-center md:items-start">
                    <div className="flex h-[200px] w-[400px] items-center justify-center rounded-lg border-2 border-gray-400 bg-gray-200 shadow-lg">
                      <img
                        src="https://placehold.co/400x200"
                        alt="Step 1"
                        className="h-full w-full rounded object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-8 md:flex-row md:items-stretch md:gap-0">
                  {/* Image */}
                  <div className="order-2 flex flex-1 items-center justify-center md:order-1 md:items-start">
                    <div className="flex h-[200px] w-[400px] items-center justify-center rounded-lg border-2 border-gray-400 bg-gray-200 shadow-lg">
                      <img
                        src="https://placehold.co/400x200"
                        alt="Step 2"
                        className="h-full w-full rounded object-cover"
                      />
                    </div>
                  </div>
                  {/* Step marker */}
                  <div className="order-1 flex flex-col items-center pl-0 md:order-2 md:w-1/2 md:items-start md:pl-12">
                    <div className="mb-4 flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-indigo-900 bg-indigo-500 text-lg font-bold text-white shadow-lg">
                        2
                      </div>
                      <span className="ml-3 text-lg font-semibold text-indigo-400">
                        Step 2
                      </span>
                    </div>
                    <div className="text-left md:text-left">
                      <h3 className="mb-2 text-2xl font-bold">
                        {t('howItWorksStep2Title')}
                      </h3>
                      <p className="mb-2 text-gray-300">
                        {t('howItWorksStep2Description')}
                      </p>
                      <p className="text-gray-400">{t('howItWorksStep2Time')}</p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center gap-8 md:flex-row md:items-stretch md:gap-0">
                  {/* Step marker */}
                  <div className="flex flex-col items-center pr-0 md:w-1/2 md:items-end md:pr-12">
                    <div className="mb-4 flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-purple-900 bg-purple-500 text-lg font-bold text-white shadow-lg">
                        3
                      </div>
                      <span className="ml-3 text-lg font-semibold text-purple-400">
                        Step 3
                      </span>
                    </div>
                    <div className="text-right md:text-right">
                      <h3 className="mb-2 text-2xl font-bold">
                        {t('howItWorksStep3Title')}
                      </h3>
                      <p className="mb-2 text-gray-300">
                        {t('howItWorksStep3Description')}
                      </p>
                      <p className="text-gray-400">{t('howItWorksStep3Time')}</p>
                    </div>
                  </div>
                  {/* Image */}
                  <div className="flex flex-1 items-center justify-center md:items-start">
                    <div className="flex h-[200px] w-[400px] items-center justify-center rounded-lg border-2 border-gray-400 bg-gray-200 shadow-lg">
                      <img
                        src="https://placehold.co/400x200"
                        alt="Step 3"
                        className="h-full w-full rounded object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section (Reference to existing component) */}
        <section id="pricing" className="py-20">
          <PricingSection />
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-b from-gray-900/0 to-gray-900/70 py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-12 text-center backdrop-blur-lg">
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                {t('readyToTransform')}
              </h2>
              <p className="mb-10 text-xl text-gray-300">
                {t('joinThousands')}
              </p>
              <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <a
                  className="group flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-medium text-white transition-all hover:from-blue-600 hover:to-purple-700 sm:w-auto"
                  title="This website is still in development and this will be updated soon."
                  style={{ cursor: "not-allowed" }}
                >
                  {t('startFreeTrial')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#"
                  className="w-full rounded-lg border border-gray-600 px-8 py-4 text-lg font-medium text-white transition-colors hover:border-blue-400 hover:text-blue-400 sm:w-auto"
                >
                  {t('scheduleDemo')}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* Video Modal (Hidden by default) */}
      {isVideoPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl">
            <button
              className="absolute -right-4 -top-12 text-white hover:text-gray-300"
              onClick={() => setIsVideoPlaying(false)}
            >
              <span className="text-3xl">×</span>
            </button>
            <div className="overflow-hidden rounded-xl border border-gray-700">
              <div className="aspect-video bg-gray-900">
                {/* Video placeholder */}
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  Video Player Placeholder
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .highlight-section {
            animation: highlight 2s ease-in-out;
          }
          @keyframes highlight {
            0%, 100% { background-color: transparent; }
            50% { background-color: rgba(59, 130, 246, 0.2); }
          }
        `}
      </style>
    </div>
  );
}
