import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TeamMember from "../../components/TeamMember";

const teamMembers = [
  {
    name: "Tushin Kulshreshtha",
    role: "Backend Lead",
    description:
      "Backend architect with a passion for building scalable, secure, and efficient systems.",
    imageUrl: "/tushin.jpeg",
  },
  {
    name: "Ansh Patel",
    role: "Frontend Lead",
    description:
      "Frontend guru crafting pixel-perfect, performant, and delightful user interfaces.",
    imageUrl: "/ansh.jpg",
  },
  {
    name: "Victoria Barnett",
    role: "Team Lead",
    description:
      "Oversees product direction, ensuring strategic alignment with goals.",
    imageUrl: "/victoria.jpg",
  },
  {
    name: "Alison John",
    role: "Database Administrator",
    description:
      "Manages and optimizes databases to ensure data integrity and performance.",
    imageUrl: "/Alison.jpg",
  },
  {
    name: "Pritham Sandhu",
    role: "Software Architect",
    description: "Develops robust and scalable solutions to drive efficiency.",
    imageUrl: "/Pritham.jpeg",
  },
  {
    name: "Nidhey Patel",
    role: "Technical Writer",
    description: "Generates a technical documentation of the project.",
    imageUrl: "/Nidhey.jpg",
  },
  {
    name: "Yikang Xu",
    role: "GitHub Master",
    description:
      "Oversees the version control system, manages branches, merges code, and maintains repository integrity.",
    imageUrl: "/yikang.jpg",
  },
];

const About = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div>
        <div className="absolute inset-0 z-20 flex items-center justify-center"></div>
        <div className="container relative z-10 mx-auto px-4 py-24">
          <h1 className="mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-center text-5xl font-bold text-gray-100 text-transparent">
            Our Stellar Team
          </h1>
          <div className="grid grid-cols-1 justify-center gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex justify-center">
                <TeamMember {...member} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
