"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function TaskComponent() {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [comments, setComments] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  // Handle adding a task with all the details
  const handleAddTask = () => {
    if (taskTitle && dueDate && assignedUsers.length > 0) {
      const [year, month, day] = dueDate.split("-").map(Number);
      const formattedDate = new Date(year, month - 1, day);

      const newTask = {
        title: taskTitle,
        description: taskDescription,
        assignedUsers: assignedUsers,
        dueDate: formattedDate.toLocaleDateString("en-US"), // Format date as MM/DD/YYYY
        comments: comments,
      };

      setTasks([...tasks, newTask]);

      // Clear all fields after adding the task
      setTaskTitle("");
      setTaskDescription("");
      setAssignedUsers([]);
      setNewUser("");
      setDueDate("");
      setComments("");
    }
  };

  // Rank tasks based on their due date (Sort tasks in ascending order of due date)
  const rankedTasks = tasks.sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  );

  // Add user to assignedUsers list when the user presses Enter
  const handleUserChange = (e) => {
    setNewUser(e.target.value);
    if (e.key === "Enter" && newUser && !assignedUsers.includes(newUser)) {
      setAssignedUsers([...assignedUsers, newUser]);
      setNewUser(""); // Clear the input field after adding the user
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h2
        className="mb-8 text-center text-4xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        New Task
      </motion.h2>

      {/* Task Input Section */}
      <div className="mb-8">
        <div className="flex gap-4">
          {/* Task Title */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-full rounded-md border border-gray-700 bg-gray-800/50 py-2 pl-4 pr-10 text-white transition-all duration-300 placeholder:text-gray-400 focus:outline-none ${
                isFocused ? "border-blue-500" : "hover:border-gray-600"
              }`}
            />
          </div>

          {/* Due Date */}
          <div className="relative w-32">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-full rounded-md border border-gray-700 bg-gray-800/50 p-2 text-white transition-all duration-300 placeholder:text-gray-400 focus:outline-none ${
                isFocused ? "border-blue-500" : "hover:border-gray-600"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Task Description */}
      <div className="mb-8">
        <textarea
          placeholder="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="w-full rounded-md border border-gray-700 bg-gray-800/50 p-2 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Assign Users */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Assign User (press Enter to add)"
          value={newUser}
          onChange={handleUserChange}
          onKeyDown={handleUserChange}
          className="w-full rounded-md border border-gray-700 bg-gray-800/50 p-2 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
        />
        <div className="mt-4 space-y-2">
          {assignedUsers.map((user, index) => (
            <p key={index} className="text-gray-300">
              {user}
            </p>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="mb-8">
        <textarea
          placeholder="Comments (optional)"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full rounded-md border border-gray-700 bg-gray-800/50 p-2 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Add Task Button */}
      <div className="text-center">
        <button
          onClick={handleAddTask}
          disabled={!taskTitle || !dueDate || assignedUsers.length === 0}
          className="rounded-md bg-blue-500 px-6 py-3 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Add Task
        </button>
      </div>
    </div>
  );
}
