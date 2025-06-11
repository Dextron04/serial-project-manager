import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import ParticleBackground from "./components/particleBackground";

const teammembers = [
  { id: 1, name: "Ansh Patel" },
  { id: 2, name: "Tushin Kulshreshtha" },
  { id: 3, name: "Victoria Barnett" },
  { id: 4, name: "Nidhay Patel" },
  { id: 5, name: "Pritham Sandhu" },
  { id: 6, name: "Alison John" },
  { id: 7, name: "Yikang Xu" }
];

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeFeed, setActiveFeed] = useState("General Activity");
  const [search, setSearch] = useState("");

  return (
    <div className={`${darkMode ? "dark" : ""} h-screen flex relative overflow-hidden`}>
      <ParticleBackground />
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 dark:bg-gray-900 p-4 flex flex-col relative z-10">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 bg-gray-200 dark:bg-gray-800 rounded mb-4"
        >
          {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-600" />}
        </button>
        <nav className="space-y-2">
          <a href="/profile" className="block p-2 bg-gray-300 dark:bg-gray-700 rounded">Profile</a>
          <a href="/org-settings" className="block p-2 bg-gray-300 dark:bg-gray-700 rounded">Organization Settings</a>
          <a href="/project-settings" className="block p-2 bg-gray-300 dark:bg-gray-700 rounded">Project Settings</a>
          <a href="/team-settings" className="block p-2 bg-gray-300 dark:bg-gray-700 rounded">Team Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white relative z-10">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <input
          type="text"
          placeholder="Search Team Members"
          className="mt-4 p-2 w-full border dark:border-gray-600 bg-gray-200 dark:bg-gray-700 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-3 gap-4 mt-6">
          {/* Team Members List */}
          <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded">
            <h2 className="font-bold">Team Members</h2>
            {teammembers
              .filter(member => member.name.toLowerCase().includes(search.toLowerCase()))
              .map(member => (
                <p key={member.id} className="cursor-pointer" onClick={() => setActiveFeed(`Activity for ${member.name}`)}>
                  {member.name}
                </p>
              ))}
          </div>

          {/* Organizations */}
          <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded">
            <h2 className="font-bold">Organizations</h2>
            <p className="cursor-pointer" onClick={() => setActiveFeed("Activity for Organization X")}>Organization X</p>
            <p className="cursor-pointer" onClick={() => setActiveFeed("Activity for Organization Y")}>Organization Y</p>
          </div>

          {/* Projects */}
          <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded">
            <h2 className="font-bold">Projects</h2>
            <p className="cursor-pointer" onClick={() => setActiveFeed("Activity for Project A")}>Project A</p>
            <p className="cursor-pointer" onClick={() => setActiveFeed("Activity for Project B")}>Project B</p>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mt-6 p-4 bg-gray-300 dark:bg-gray-600 rounded">
          <h2 className="font-bold">{activeFeed}</h2>
          <p>Latest updates go here...</p>
        </div>
      </main>
    </div>
  );
}
