import React, { useState } from "react";

<div className="mt-8">
  <h3 className="mb-4 text-2xl font-bold">
    Priority Tasks (Ranked by Due Date)
  </h3>
  {rankedTasks.length > 0 ? (
    <ul className="space-y-4">
      {rankedTasks.map((task, index) => (
        <li
          key={index}
          className="rounded-md border border-gray-700 bg-gray-800 p-4"
        >
          <div className="font-bold text-white">{task.title}</div>
          <div className="text-gray-400">{task.dueDate}</div>
          <div className="text-gray-300">{task.assignedUsers.join(", ")}</div>
          <div className="text-gray-400">{task.comments}</div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-400">No priority tasks to display</p>
  )}
</div>;
