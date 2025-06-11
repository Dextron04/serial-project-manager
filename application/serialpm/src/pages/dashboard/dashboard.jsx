import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeFeed, setActiveFeed] = useState("General Activity");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [showCreateProjectPopup, setShowCreateProjectPopup] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "active",
    owner: "",
    budget: "",
    milestones: "",
  });
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_BACKEND_FETCH_URL;

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const organizationId = user?.organization_id;
      const token = localStorage.getItem("token");

      if (!organizationId || !token) {
        console.error("Missing organization ID or token");
        setProjects([]);
        setUsers([]);
        return;
      }

      // Fetch projects in the organization
      const projectsRes = await fetch(
        `${API_URL}/api/organizations/${organizationId}/projects`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const projects = await projectsRes.json();
      setProjects(Array.isArray(projects) ? projects : []);

      // Fetch users in the organization
      const usersRes = await fetch(`${API_URL}/api/organization/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const users = await usersRes.json();
      setUsers(Array.isArray(users) ? users : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setProjects([]);
      setUsers([]);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/tasks?project_id=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);

    // Get user details from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const lightToggle = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      alert("Project created successfully!");
      setShowCreateProjectPopup(false);
      setNewProject({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "active",
        owner: "",
        budget: "",
        milestones: "",
      });
      fetchData(); // Refresh the project list
    } catch (error) {
      console.error("Error creating project:", error);
      alert(error.message || "Failed to create project");
    }
  };

  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } relative flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white`}
    >
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 md:hidden"
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {mobileMenuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        } fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-gray-800/70 shadow-xl backdrop-blur-md transition-transform duration-300 ease-in-out md:relative md:z-10`}
      >
        {/* Logo and Dark Mode Toggle */}
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h1 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
            WorkSpace
          </h1>
          <button
            onClick={lightToggle}
            className="rounded-full p-2 transition-colors hover:bg-gray-700"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        </div>

        {/* Organization Info */}
        <div className="border-b border-gray-700 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Organization
          </h2>
          <div className="mt-2 rounded-lg bg-gray-700/50 p-3">
            <div className="font-medium text-white">
              {user?.organization_name || "Your Organization"}
            </div>
            <div className="mt-1 text-xs text-gray-400">
              Admin: {user?.admin_email || "N/A"}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Navigation
          </h2>
          <div className="space-y-1">
            <a
              href="/profile"
              className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Profile
            </a>
          </div>
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-purple-400">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400">{user?.role || "Role"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 flex-col overflow-hidden bg-gray-900/30 backdrop-blur-sm">
        {/* Header */}
        <header className="border-b border-gray-800 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <div className="relative mt-4 w-full sm:mt-0 sm:w-auto">
              <input
                type="text"
                placeholder="Search Team Members"
                className="w-full rounded-full bg-gray-800 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            {/* Team Members */}
            <div className="overflow-hidden rounded-xl bg-gray-800/70 shadow-lg backdrop-blur-md">
              <div className="border-b border-gray-700 p-4">
                <h2 className="text-lg font-semibold">Team Members</h2>
              </div>
              <div className="p-4">
                {users.filter((user) =>
                  user.name.toLowerCase().includes(search.toLowerCase())
                ).length > 0 ? (
                  users
                    .filter((user) =>
                      user.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((user) => (
                      <div
                        key={user.user_id}
                        className="group mb-2 flex cursor-pointer items-center rounded-lg p-2 transition-colors hover:bg-gray-700/50"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="py-4 text-center text-gray-400">
                    No team members found
                  </p>
                )}
              </div>
            </div>

            {/* Projects */}
            <div className="overflow-hidden rounded-xl bg-gray-800/70 shadow-lg backdrop-blur-md">
              <div className="border-b border-gray-700 p-4">
                <h2 className="text-lg font-semibold">Projects</h2>
              </div>
              <div className="flex items-center space-x-2 p-4">
                <select
                  className="w-full appearance-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const projId = e.target.value;
                    setSelectedProjectId(projId);
                    const selected = projects.find(
                      (p) => p.project_id === projId
                    );
                    if (selected) {
                      setSelectedProject(selected);
                      setActiveFeed(`Tasks for ${selected.title}`);
                      fetchTasks(selected.project_id);
                    }
                  }}
                  value={selectedProjectId}
                >
                  <option value="" disabled>
                    Select a project
                  </option>
                  {projects.map((project) => (
                    <option key={project.project_id} value={project.project_id}>
                      {project.title}
                    </option>
                  ))}
                </select>
                <button
                  className="ml-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
                  disabled={!selectedProjectId}
                  onClick={() => {
                    if (selectedProjectId) {
                      navigate(`/project/${selectedProjectId}`);
                    }
                  }}
                >
                  Go
                </button>
              </div>
              <div className="p-4">
                <button
                  onClick={() => setShowCreateProjectPopup(true)}
                  className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Project Popup */}
      {showCreateProjectPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">
              Create Project
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newProject.title}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2 text-white"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newProject.description}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2 text-white"
              />
              <input
                type="date"
                name="start_date"
                value={newProject.start_date}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2 text-white"
              />
              <input
                type="date"
                name="end_date"
                value={newProject.end_date}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2 text-white"
              />
              <select
                name="status"
                value={newProject.status}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2 text-white"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on hold">On Hold</option>
              </select>
              <input
                type="number"
                name="budget"
                placeholder="Budget"
                value={newProject.budget}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2 text-white"
              />
              <input
                type="text"
                name="milestones"
                placeholder="Milestones"
                value={newProject.milestones}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2 text-white"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateProjectPopup(false)}
                className="rounded-lg bg-gray-700 px-4 py-2 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
