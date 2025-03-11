import React from "react";
import "./styles.css"; // Import the styles.css file

const TaskList = ({ searchTerm }) => {
  const tasks = [
    "Complete React project",
    "Prepare for meeting",
    "Write documentation",
    "Plan next sprint",
  ];

  // Filter tasks based on the search term
  const filteredTasks = tasks.filter((task) =>
    task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="task-list">
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task, index) => (
          <div key={index} className="task-item">
            {task}
          </div>
        ))
      ) : (
        <p className="no-tasks-message">No tasks found</p>
      )}
    </div>
  );
};

export default TaskList;
