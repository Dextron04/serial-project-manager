import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Plus,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  List,
  Calendar,
  Clock,
} from "lucide-react";
import TaskComponent from "../../components/TaskComponent";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useParams, useLocation } from "react-router-dom";

const Project = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const [showTaskComponent, setShowTaskComponent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTaskList, setShowTaskList] = useState(false); // State for Task List popup
  const [showNewTaskForm, setShowNewTaskForm] = useState(false); // State for New Task popup
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]); // State for tasks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numChunks, setNumChunks] = useState(10);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
    budget: "",
    milestones: "",
    end_date: "",
  });
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
    tags: "",
  });
  const [userSearchQuery, setUserSearchQuery] = useState(""); // Search query
  const [userSearchResults, setUserSearchResults] = useState([]); // Search results
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [assignedUser, setAssignedUser] = useState(null); // Selected user
  const [selectedTask, setSelectedTask] = useState(null); // Selected task
  const [taskDetailsLoading, setTaskDetailsLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // Task being edited
  const containerRef = useRef(null);
  const transformWrapperRef = useRef(null);
  const API_URL = import.meta.env.VITE_BACKEND_FETCH_URL;
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState(
    "Project Management View"
  );

  // Debounce the search query
  useEffect(() => {
    console.log(projectId);

    const handler = setTimeout(() => {
      setDebouncedQuery(userSearchQuery);
    }, 300); // Delay of 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [userSearchQuery]);

  // Fetch users when the debounced query changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedQuery.length < 3) {
        setUserSearchResults([]);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/users?query=${debouncedQuery}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const users = await response.json();
        setUserSearchResults(users);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    };

    fetchUsers();
  }, [debouncedQuery]);

  const handleNewTaskClick = () => {
    setShowTaskComponent(true);
  };

  const handleCloseClick = () => {
    setShowTaskComponent(false);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleSettingsCloseClick = () => {
    setShowSettings(false);
  };

  const handleTaskListClick = () => {
    setShowTaskList(true);
  };

  const handleTaskListCloseClick = () => {
    setShowTaskList(false);
  };

  const handleNewTaskFormOpen = () => {
    setShowNewTaskForm(true);
  };

  const handleNewTaskFormClose = () => {
    setShowNewTaskForm(false);
    setNewTaskData({
      title: "",
      description: "",
      priority: "medium",
      due_date: "",
      tags: "",
    });
    setAssignedUser(null); // Reset assigned user
    setUserSearchQuery(""); // Reset search query
    setUserSearchResults([]); // Clear search results
  };

  const handleNewTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateTask = async () => {
    try {
      if (!newTaskData.title.trim()) {
        alert("Task title is required");
        return;
      }

      const taskPayload = {
        ...newTaskData,
        project_id: projectId,
        assigned_user: assignedUser ? assignedUser.user_id : null, // Include assigned user
      };

      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(taskPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create task");
      }

      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
      handleNewTaskFormClose();
      alert("Task created successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      alert(error.message || "Failed to create task");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplySettings = async () => {
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        alert("Project title is required");
        return;
      }

      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        milestones: formData.milestones.trim(),
        end_date: formData.end_date || null,
      };

      console.log("Sending update request:", updateData);

      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update project");
      }

      const updatedProject = await response.json();
      console.log("Project updated successfully:", updatedProject);

      // Update local state
      setProject(updatedProject);
      setShowSettings(false);

      // Show success message
      alert("Project settings updated successfully");
    } catch (error) {
      console.error("Error updating project:", error);
      alert(error.message || "Failed to update project settings");
    }
  };

  const handleZoomIn = () => {
    if (transformWrapperRef.current) {
      transformWrapperRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (transformWrapperRef.current) {
      transformWrapperRef.current.zoomOut();
    }
  };

  const handleZoomOutToScale = (scale) => {
    if (transformWrapperRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const viewportWidth = window.innerWidth;
      const offsetX = (viewportWidth - containerWidth * scale) / 2 + 400;
      transformWrapperRef.current.setTransform(offsetX, 0, scale, 200);
    }
  };

  const renderChunks = () => {
    const chunks = [];
    const chunkWidth = 100 / numChunks;
    for (let i = 0; i < numChunks; i++) {
      chunks.push(
        <div
          key={i}
          className="absolute bottom-0 top-0 w-0.5 bg-white"
          style={{ left: `${i * chunkWidth}%` }}
        />
      );
    }
    return chunks;
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/tasks?project_id=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data); // Update tasks state
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleUserSearch = async (query) => {
    setUserSearchQuery(query);

    if (!query.trim()) {
      setUserSearchResults([]);
      return;
    }
  };

  const handleUserSelect = (user) => {
    setAssignedUser(user);
    setUserSearchQuery(user.username); // Show selected user in the input
    setUserSearchResults([]); // Clear search results
  };

  const handleTaskClick = async (task) => {
    setTaskDetailsLoading(true); // Set loading state
    try {
      const response = await fetch(`${API_URL}/api/tasks/${task.task_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task details");
      }

      const taskDetails = await response.json();
      console.log("Fetched task details:", taskDetails); // Log task details
      setSelectedTask(taskDetails); // Set the full task details
    } catch (error) {
      console.error("Error fetching task details:", error);
      alert("Failed to fetch task details");
    } finally {
      setTaskDetailsLoading(false); // Clear loading state
    }
  };

  const handleCloseTaskModal = () => {
    setSelectedTask(null); // Clear the selected task
  };

  const handleStatusChange = (newStatus) => {
    setSelectedTask((prevTask) => ({
      ...prevTask,
      status: newStatus,
    }));
  };

  const handleSaveStatus = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/tasks/${selectedTask.task_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: selectedTask.status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.task_id === updatedTask.task_id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status");
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      // Optimistically update the UI
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.task_id === taskId ? { ...task, status: "Completed" } : task
        )
      );

      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "Completed" }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete task");
      }

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.task_id === updatedTask.task_id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Error completing task:", error);
      alert("Failed to complete task");
    }
  };

  const handleResumeTask = async (taskId) => {
    try {
      // Optimistically update the UI
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.task_id === taskId ? { ...task, status: "active" } : task
        )
      );

      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "active" }),
      });

      if (!response.ok) {
        throw new Error("Failed to resume task");
      }

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.task_id === updatedTask.task_id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Error resuming task:", error);
      alert("Failed to resume task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.task_id !== taskId)
      );
      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };

  const handleUpdateTask = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/tasks/${editingTask.task_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editingTask),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update task");
      }

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.task_id === updatedTask.task_id ? updatedTask : task
        )
      );
      setEditingTask(null); // Close the modal
      alert("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      alert(error.message || "Failed to update task");
    }
  };

  // Helper: parse date string to timestamp (ms)
  const parseDate = (dateStr) => (dateStr ? new Date(dateStr).getTime() : null);
  const startDate = parseDate(project?.start_date);
  const endDate = parseDate(project?.end_date);
  const timelineDuration = startDate && endDate ? endDate - startDate : null;

  // Helper: get position (0-1) for a date between start and end
  const getPosition = (dateStr, idx, arrLen) => {
    if (startDate && endDate && dateStr) {
      const t = parseDate(dateStr);
      if (t && t >= startDate && t <= endDate && timelineDuration > 0) {
        return (t - startDate) / timelineDuration;
      }
    }
    // fallback: distribute evenly
    return arrLen > 1 ? idx / (arrLen - 1) : 0;
  };

  // Helper: format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper: get N evenly spaced ticks between start and end
  const getDateTicks = (n) => {
    if (!startDate || !endDate || n < 2) return [];
    const ticks = [];
    for (let i = 0; i < n; i++) {
      const t = startDate + ((endDate - startDate) * i) / (n - 1);
      ticks.push(new Date(t));
    }
    return ticks;
  };
  const dateTicks = getDateTicks(6);

  // Helper: get all task positions, ensuring every task is shown
  const getAllTaskPositions = (tasks) => {
    return tasks.map((task, i) => {
      let pos;
      if (task.due_date && startDate && endDate && timelineDuration > 0) {
        // Place by due_date
        const t = parseDate(task.due_date);
        if (t && t >= startDate && t <= endDate) {
          pos = (t - startDate) / timelineDuration;
        } else {
          // If due_date is outside range, clamp to 0 or 1
          pos = t < startDate ? 0 : 1;
        }
      } else {
        // No due_date: distribute evenly
        pos = tasks.length > 1 ? i / (tasks.length - 1) : 0.5;
      }
      return { ...task, _pos: pos };
    });
  };
  const allTaskPositions = getAllTaskPositions(tasks);
  // Debug: log all tasks and their positions
  console.log("All tasks:", tasks, "All task positions:", allTaskPositions);
  // Group by position (rounded to 2 decimals) for stacking
  const getTaskStacksAll = (taskPositions) => {
    const stacks = {};
    taskPositions.forEach((task) => {
      const key = Math.round(task._pos * 100) / 100;
      if (!stacks[key]) stacks[key] = [];
      stacks[key].push(task);
    });
    return stacks;
  };
  const taskStacks = getTaskStacksAll(allTaskPositions);

  // Helper: get color for status
  const statusColor = (status) => {
    switch (status) {
      case "Completed":
        return "border-green-500 ring-green-300";
      case "active":
        return "border-blue-500 ring-blue-300";
      case "on hold":
        return "border-yellow-500 ring-yellow-300";
      default:
        return "border-gray-400 ring-gray-300";
    }
  };
  // Helper: get color for priority
  const priorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-400";
      case "low":
        return "bg-green-400";
      default:
        return "bg-gray-400";
    }
  };

  // Helper: get vertical offset for priority
  const priorityOffset = (priority) => {
    switch (priority) {
      case "high":
        return -36; // above the bar
      case "medium":
        return 0; // centered on the bar
      case "low":
        return 36; // below the bar
      default:
        return 0;
    }
  };

  const tagColor = (tag) => {
    const colors = {
      QA: "bg-blue-500",
      Documentation: "bg-green-500",
      Frontend: "bg-purple-500",
      Backend: "bg-red-500",
    };
    return colors[tag] || "bg-gray-500"; // Default color
  };

  const filteredTasks =
    selectedFilter === "Project Management View"
      ? tasks
      : tasks.filter((task) =>
          task.tags
            ?.split(",")
            .map((tag) => tag.trim())
            .includes(selectedFilter)
        );

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // If we have project data from search results, use it
        if (location.state?.project) {
          const projectData = location.state.project;
          setProject(projectData);
          console.log("Project data from location state:", projectData); // Log project data
          setFormData({
            title: projectData.title || "",
            description: projectData.description || "",
            status: projectData.status || "active",
            budget: projectData.budget || "",
            milestones: projectData.milestones || "",
            end_date: projectData.end_date
              ? new Date(projectData.end_date).toISOString().split("T")[0]
              : "",
          });
          setLoading(false);
          return;
        }

        // Otherwise, fetch from API
        const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Project not found");
        }

        const data = await response.json();
        console.log("Fetched project data from API:", data); // Log project data
        setProject(data);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          status: data.status || "active",
          budget: data.budget || "",
          milestones: data.milestones || "",
          end_date: data.end_date
            ? new Date(data.end_date).toISOString().split("T")[0]
            : "",
        });
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    fetchTasks(); // Fetch tasks for the project
  }, [projectId, location.state]);

  useEffect(() => {
    const handleWheel = (event) => {
      if (transformWrapperRef.current) {
        if (event.deltaY > 0) {
          transformWrapperRef.current.zoomOut();
        } else {
          transformWrapperRef.current.zoomIn();
        }
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Floating action buttons (moved outside timeline card, with extra margin and z-40)
  const FloatingActions = () => (
    <div className="fixed bottom-24 right-8 z-40 flex flex-col space-y-3 md:bottom-24 md:right-8">
      <button
        className="rounded-full bg-blue-600 p-3 shadow-lg transition hover:bg-blue-700"
        title="New Task"
        onClick={handleNewTaskFormOpen}
      >
        <Plus className="h-6 w-6 text-white" />
      </button>
      {/* <button className="rounded-full bg-purple-600 p-3 shadow-lg hover:bg-purple-700 transition" title="Zoom In" onClick={() => setZoomLevel(z => Math.min(z + 0.25, 3))}>
        <ZoomIn className="h-6 w-6 text-white" />
      </button> */}
      {/* <button className="rounded-full bg-purple-600 p-3 shadow-lg hover:bg-purple-700 transition" title="Zoom Out" onClick={() => setZoomLevel(z => Math.max(z - 0.25, 0.5))}>
        <ZoomOut className="h-6 w-6 text-white" />
      </button> */}
      <button
        className="rounded-full bg-gray-600 p-3 shadow-lg transition hover:bg-gray-700"
        title="Reset Zoom"
        onClick={() => setZoomLevel(1)}
      >
        <RefreshCw className="h-6 w-6 text-white" />
      </button>
      <button
        className="rounded-full bg-gray-700 p-3 text-white shadow-lg transition hover:bg-gray-800"
        onClick={handleSettingsClick}
        title="Project Settings"
      >
        <Settings size={24} />
      </button>
      <button
        className="rounded-full bg-purple-500 p-3 text-white shadow-lg transition hover:bg-purple-600"
        onClick={handleTaskListClick}
        title="Task List"
      >
        <List size={24} />
      </button>
    </div>
  );

  // Helper: format date for display
  const formatTimelineDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const ProjectTimeline = ({ project, tasks }) => {
    const [zoom, setZoom] = useState(1);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isMoving, setIsMoving] = useState(false);
    const [startX, setStartX] = useState(0);
    const timelineRef = useRef(null);
    const [selectedFilter, setSelectedFilter] = useState(
      "Project Management View"
    );

    const filteredTasks =
      selectedFilter === "Project Management View"
        ? tasks
        : tasks.filter((task) =>
            task.tags
              ?.split(",")
              .map((tag) => tag.trim())
              .includes(selectedFilter)
          );

    // Find the earliest start date and latest end date across the project and its tasks
    const allStartDates = [
      project?.start_date,
      ...tasks.map((task) => task.created_date || project?.start_date),
    ]
      .filter(Boolean)
      .map((d) => new Date(d));
    const allEndDates = [
      project?.end_date,
      ...tasks.map((task) => task.due_date || project?.end_date),
    ]
      .filter(Boolean)
      .map((d) => new Date(d));
    const earliestDate = new Date(Math.min(...allStartDates));
    const latestDate = new Date(Math.max(...allEndDates));

    // Calculate the total number of days in the timeline
    const totalDays =
      Math.ceil((latestDate - earliestDate) / (24 * 60 * 60 * 1000)) + 1;

    // Generate date markers for the timeline
    const dateMarkers = [];
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(earliestDate.getTime()); // clone the date
      date.setDate(earliestDate.getDate() + i); // increment by i days
      dateMarkers.push(date);
    }

    // Calculate position for a date on the timeline
    const getPositionForDate = (date) => {
      const days = Math.ceil(
        (new Date(date) - earliestDate) / (24 * 60 * 60 * 1000)
      );
      return days * 80 * zoom; // 80px per day, scaled by zoom
    };

    // Calculate width for a task based on its duration
    const getWidthForTask = (startDate, endDate) => {
      const days =
        Math.ceil(
          (new Date(endDate) - new Date(startDate)) / (24 * 60 * 60 * 1000)
        ) + 1;
      return days * 80 * zoom; // 80px per day, scaled by zoom
    };

    // Handle mouse down for drag scrolling
    const handleMouseDown = (e) => {
      setIsMoving(true);
      setStartX(e.clientX + scrollPosition);
    };

    // Handle mouse move for drag scrolling
    const handleMouseMove = (e) => {
      if (!isMoving) return;
      const newScrollPosition = startX - e.clientX;
      setScrollPosition(Math.max(0, newScrollPosition));
      if (timelineRef.current) {
        timelineRef.current.scrollLeft = newScrollPosition;
      }
    };

    // Handle mouse up to stop drag scrolling
    const handleMouseUp = () => {
      setIsMoving(false);
    };

    // Handle mouse leave to stop drag scrolling
    const handleMouseLeave = () => {
      setIsMoving(false);
    };

    // Handle zoom in
    const handleZoomIn = () => {
      setZoom(Math.min(zoom + 0.2, 3));
    };

    // Handle zoom out
    const handleZoomOut = () => {
      setZoom(Math.max(zoom - 0.2, 0.5));
    };

    // Handle task click
    const handleTaskClick = (task) => {
      setSelectedTask(task);
    };

    // Close task details
    const closeTaskDetails = () => {
      setSelectedTask(null);
    };

    // Update scrollLeft when scrollPosition changes
    useEffect(() => {
      if (timelineRef.current) {
        timelineRef.current.scrollLeft = scrollPosition;
      }
    }, [scrollPosition]);

    // Custom task colors that match the design
    const getTaskColor = (index) => {
      const colors = [
        "from-blue-400 to-purple-400",
        "from-purple-400 to-blue-400",
        "from-blue-500 to-indigo-500",
        "from-indigo-500 to-purple-500",
        "from-purple-500 to-pink-500",
      ];
      return colors[index % colors.length];
    };

    return (
      <div className="flex h-full w-full flex-col">
        <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 p-4">
          <h2 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
            Project Timeline
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="rounded-lg border border-gray-600 bg-gray-700/50 p-2.5 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="Project Management View">
                Project Management View
              </option>
              <option value="QA">QA</option>
              <option value="Documentation">Documentation</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
            </select>
          </div>
        </div>

        <div
          ref={timelineRef}
          className="scrollbar-thin scrollbar-thumb-gray-800 flex-1 overflow-x-auto border-gray-600 bg-gray-900"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: isMoving ? "grabbing" : "grab" }}
        >
          <div
            className="relative"
            style={{
              width: `${getPositionForDate(latestDate) + 200}px`,
              minHeight: "500px",
            }}
          >
            {/* Date markers */}
            <div className="sticky top-0 z-10 flex h-10 border-b border-gray-800 bg-gray-900">
              {dateMarkers.map((date, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center border-r border-gray-800"
                  style={{
                    width: `${80 * zoom}px`,
                    minWidth: `${80 * zoom}px`,
                  }}
                >
                  <span className="text-xs font-medium text-gray-400">
                    {formatTimelineDate(date)}
                  </span>
                </div>
              ))}
            </div>

            {/* Project and tasks */}
            <div className="mt-4">
              <div className="mb-8">
                <div className="mb-2 px-4 font-bold text-gray-200">
                  {project.title}
                </div>
                {filteredTasks.map((task, taskIndex) => (
                  <div key={task.task_id} className="relative mx-4 mb-2 h-12">
                    <div
                      className={`absolute flex h-10 cursor-pointer items-center rounded-lg shadow ${tagColor(
                        task.tags?.split(",")[0]?.trim()
                      )}`}
                      style={{
                        left: `${getPositionForDate(
                          task.created_date || project?.start_date
                        )}px`,
                        width: `${getWidthForTask(
                          task.created_date || project?.start_date,
                          task.due_date || project?.end_date
                        )}px`,
                        opacity: 0.9,
                      }}
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="truncate px-3 font-medium text-white">
                        {task.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Task details modal */}
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="w-96 rounded-xl border border-gray-700 bg-gray-800/90 p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent">
                  {selectedTask.title}
                </h3>
                <button
                  onClick={closeTaskDetails}
                  className="text-gray-400 hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="w-24 text-gray-400">Assignee:</span>
                  <span className="text-gray-200">
                    {selectedTask.assigned_user_name ||
                      selectedTask.assignee ||
                      "Unassigned"}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="w-24 text-gray-400">Start Date:</span>
                  <div className="flex items-center text-gray-200">
                    <Calendar size={16} className="mr-1 text-blue-400" />
                    <span>
                      {formatTimelineDate(
                        selectedTask.created_date || project?.start_date
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-24 text-gray-400">End Date:</span>
                  <div className="flex items-center text-gray-200">
                    <Calendar size={16} className="mr-1 text-blue-400" />
                    <span>
                      {formatTimelineDate(
                        selectedTask.due_date || project?.end_date
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-24 text-gray-400">Duration:</span>
                  <div className="flex items-center text-gray-200">
                    <Clock size={16} className="mr-1 text-purple-400" />
                    <span>
                      {project?.start_date && project?.end_date
                        ? Math.ceil(
                            (new Date(project.end_date) -
                              new Date(project.start_date)) /
                              (24 * 60 * 60 * 1000)
                          ) + 1
                        : "N/A"}{" "}
                      days
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-lg shadow-blue-500/30 transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={closeTaskDetails}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Project not found</div>
      </div>
    );
  }

  return (
    <div className="project-page flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Project Info Card */}
      <div className="relative z-30 mb-20 mt-24 w-full max-w-3xl rounded-2xl border border-white/10 bg-gray-800/70 p-8 shadow-2xl backdrop-blur-lg">
        <h1 className="mb-2 text-4xl font-bold text-blue-200 drop-shadow">
          {project.title}
        </h1>
        <p className="text-lg text-gray-300">{project.description}</p>
        <div className="mt-2 flex justify-between text-base font-semibold text-gray-200">
          <span>Start: {formatDate(project.start_date)}</span>
          <span>End: {formatDate(project.end_date)}</span>
        </div>
      </div>
      {/* New Timeline Visualization */}
      <div className="z-30 mx-auto mb-40 flex w-full max-w-6xl flex-col items-center overflow-hidden rounded-3xl border border-gray-800 bg-gray-900">
        <ProjectTimeline project={project} tasks={tasks} />
      </div>
      {/* Floating Action Buttons */}
      <FloatingActions />

      {showTaskComponent && (
        <motion.div
          className="fixed bottom-16 left-4 transform"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-128 h-128 relative overflow-auto border border-gray-700 bg-purple-800 p-4">
            <button
              className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white"
              onClick={handleCloseClick}
            >
              X
            </button>
            <TaskComponent />
          </div>
        </motion.div>
      )}
      {showSettings && (
        <motion.div
          className="fixed right-4 top-16 z-50 transform shadow-2xl shadow-black/60"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-96 rounded-lg border border-gray-700 bg-gray-800/95 shadow-2xl backdrop-blur-sm">
            <div className="border-b border-gray-700 bg-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  Project Settings
                </h2>
                <button
                  onClick={handleSettingsCloseClick}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="max-h-[calc(100vh-12rem)] space-y-4 overflow-y-auto p-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-2.5 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder={project.title}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-2.5 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder={project.description}
                  rows="3"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-2.5 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on hold">On Hold</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Budget
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-2.5 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder={project.budget}
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Milestones
                </label>
                <input
                  type="text"
                  name="milestones"
                  value={formData.milestones}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-2.5 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder={project.milestones}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-2.5 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Assign User
                </label>
                <input
                  type="text"
                  placeholder="Search for a user..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-2.5 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {userSearchResults.length > 0 && (
                  <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-gray-600 bg-gray-800">
                    {userSearchResults.map((user) => (
                      <div
                        key={user.user_id}
                        className="cursor-pointer p-2 hover:bg-gray-700"
                        onClick={() => handleUserSelect(user)}
                      >
                        {user.username} ({user.email})
                      </div>
                    ))}
                  </div>
                )}
                {assignedUser && (
                  <p className="mt-2 text-sm text-gray-400">
                    Assigned to: {assignedUser.username} ({assignedUser.email})
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-gray-700 bg-gray-800/50 p-4">
              <div className="flex justify-end space-x-3">
                <button
                  className="rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600"
                  onClick={handleSettingsCloseClick}
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                  onClick={handleApplySettings}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {showTaskList && (
        <motion.div
          className="fixed right-4 top-16 z-50 transform shadow-2xl shadow-black/60"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-96 rounded-lg border border-gray-700 bg-gray-800/95 shadow-2xl backdrop-blur-sm">
            <div className="border-b border-gray-700 bg-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Task List</h2>
                <button
                  onClick={handleTaskListCloseClick}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="max-h-[calc(100vh-12rem)] space-y-4 overflow-y-auto p-4">
              {tasks.length > 0 ? (
                Object.entries(
                  tasks.reduce((groups, task) => {
                    const tags = task.tags
                      ? task.tags.split(",")
                      : ["Uncategorized"];
                    tags.forEach((tag) => {
                      if (!groups[tag.trim()]) groups[tag.trim()] = [];
                      groups[tag.trim()].push(task);
                    });
                    return groups;
                  }, {})
                ).map(([tag, tasks]) => (
                  <div key={tag} className="mb-6">
                    <h3 className="mb-2 text-lg font-semibold text-blue-300">
                      {tag}
                    </h3>
                    {tasks.map((task) => (
                      <div
                        key={task.task_id}
                        className="mb-4 border-b border-gray-600 pb-2"
                      >
                        <div
                          className={`${
                            task.status === "Completed"
                              ? "text-gray-500 line-through"
                              : ""
                          }`}
                        >
                          <h3
                            className={`cursor-pointer font-semibold hover:underline ${
                              task.status === "Completed"
                                ? "text-gray-400"
                                : "text-blue-300"
                            }`}
                            onClick={() => setEditingTask(task)} // Open the editing modal
                          >
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-300">
                            {task.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            Priority: {task.priority} | Due:{" "}
                            {new Date(task.due_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2 flex space-x-2">
                          {task.status === "Completed" ? (
                            <button
                              className="rounded bg-yellow-500 px-2 py-1 text-xs text-white hover:bg-yellow-600"
                              onClick={() => handleResumeTask(task.task_id)}
                            >
                              Resume
                            </button>
                          ) : (
                            <button
                              className="rounded bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600"
                              onClick={() => handleCompleteTask(task.task_id)}
                            >
                              Complete
                            </button>
                          )}
                          <button
                            className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                            onClick={() => handleDeleteTask(task.task_id)}
                          >
                            Delete
                          </button>
                          <button
                            className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                            onClick={() => setEditingTask(task)}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">
                  No tasks assigned to this project.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
      {showNewTaskForm && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-96 rounded-lg border border-gray-700 bg-gray-800/95 shadow-2xl backdrop-blur-sm">
            <div className="border-b border-gray-700 bg-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">New Task</h2>
                <button
                  onClick={handleNewTaskFormClose}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="space-y-4 p-4">
              {/* Task Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newTaskData.title}
                  onChange={handleNewTaskInputChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-2.5 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Task title"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={newTaskData.tags}
                  onChange={handleNewTaskInputChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-2.5 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., QA,Frontend,Backend"
                />
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Priority
                </label>
                <select
                  name="priority"
                  value={newTaskData.priority}
                  onChange={handleNewTaskInputChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-2.5 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Due Date
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={newTaskData.due_date}
                  onChange={handleNewTaskInputChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-2.5 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="border-t border-gray-700 bg-gray-800/50 p-4">
              <div className="flex justify-end space-x-3">
                <button
                  className="rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600"
                  onClick={handleNewTaskFormClose}
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                  onClick={handleCreateTask}
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {editingTask && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-96 rounded-lg border border-gray-700 bg-gray-800/95 shadow-2xl backdrop-blur-sm">
            <div className="border-b border-gray-700 bg-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Edit Task</h2>
                <button
                  onClick={() => setEditingTask(null)}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="space-y-4 p-4">
              {/* Task Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-2.5 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={editingTask.tags}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      tags: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-2.5 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Priority
                </label>
                <select
                  name="priority"
                  value={editingTask.priority}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-2.5 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Due Date
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={editingTask.due_date}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      due_date: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-2.5 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="border-t border-gray-700 bg-gray-800/50 p-4">
              <div className="flex justify-end space-x-3">
                <button
                  className="rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600"
                  onClick={() => setEditingTask(null)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                  onClick={handleUpdateTask}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Project;
