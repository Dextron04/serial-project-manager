import React, { useState } from "react";

<div className="mt-12 overflow-x-auto">
  <table className="min-w-full table-auto text-left text-sm">
    <thead>
      <tr>
        <th className="px-4 py-2">Project Title</th>
        <th className="px-4 py-2">Description</th>
        <th className="px-4 py-2">Due Date</th>
        <th className="px-4 py-2">Assigned Users</th>
        <th className="px-4 py-2">Comments</th>
      </tr>
    </thead>
    <tbody>
      {rankedTasks.length > 0 ? (
        rankedTasks.map((task, index) => (
          <tr key={index} className="border-b border-gray-700">
            <td className="px-4 py-2 text-gray-300">{task.title}</td>
            <td className="px-4 py-2 text-gray-300">{task.description}</td>
            <td className="px-4 py-2 text-gray-300">{task.dueDate}</td>
            <td className="px-4 py-2 text-gray-300">
              {task.assignedUsers.join(", ")}
            </td>
            <td className="px-4 py-2 text-gray-300">{task.comments}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="px-4 py-2 text-center text-gray-400">
            No tasks to display
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>;
