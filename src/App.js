import React, { useState, useEffect, useCallback } from "react";
import { ListGroup, Form } from "react-bootstrap";
import TaskModal from "./components/TaskModal";
import Profile from "./components/Profile";
import MobileMenuButton from "./components/MobileMenuButton";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import moment from "moment";
import {
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarAlt,
  FaList,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

const API_URL = "https://task-manager-jdut.onrender.com/api/tasks";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedTask, setSelectedTask] = useState(null);
  const [user, setUser] = useState(null);
  const [sidebarActive, setSidebarActive] = useState(false);

  // Check for user on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        fetchTasks();
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (window.innerWidth <= 768) {
      setSidebarActive(false);
    }
  };

  const handleLogin = (userData) => {
    console.log("Login data received:", userData);
    const token = userData.token;
    const user = userData.user || userData;
    
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    
    fetchTasks();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setTasks([]);
    setFilteredTasks([]);
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, cannot fetch tasks");
        return;
      }
      
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setTasks(data);
        setFilteredTasks(data);
      } else {
        console.error("API did not return an array:", data);
        setTasks([]);
        setFilteredTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
      setFilteredTasks([]);
    }
  };

  const addTask = async (task) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      if (response.ok) {
        fetchTasks();
        setShowModal(false);
      } else {
        const errorData = await response.json();
        console.error("Error adding task:", errorData);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTaskCompletion = async (id) => {
    try {
      const task = tasks.find((t) => t._id === id);
      if (!task) return;

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const updateTask = async (task) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      if (response.ok) {
        fetchTasks();
        setSelectedTask(null);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleShowModal = () => {
    if (user) {
      setShowModal(true);
    } else {
      console.log("Please log in to add tasks");
    }
  };

  const filterTasks = useCallback(() => {
    let filtered = [];
    const now = moment();

    if (Array.isArray(tasks)) {
      switch (activeFilter) {
        case "This Day":
          filtered = tasks.filter((task) => !task.completed && moment(task.dueDate).isSame(now, "day"));
          break;
        case "This Week":
          filtered = tasks.filter((task) => !task.completed && moment(task.dueDate).isSame(now, "week"));
          break;
        case "This Month":
          filtered = tasks.filter((task) => !task.completed && moment(task.dueDate).isSame(now, "month"));
          break;
        case "Completed":
          filtered = tasks.filter((task) => task.completed);
          break;
        case "Due Tasks":
          filtered = tasks.filter((task) => !task.completed && moment(task.dueDate).isBefore(now));
          break;
        default:
          filtered = tasks;
      }

      if (searchTerm) {
        filtered = filtered.filter((task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }

    setFilteredTasks(filtered);
  }, [tasks, activeFilter, searchTerm]);

  useEffect(() => {
    filterTasks();
  }, [filterTasks]);

  return (
    <div className="app-container">
      {/* Mobile Menu Toggle Button */}
      <MobileMenuButton onClick={toggleSidebar} isActive={sidebarActive} />
      
      {/* Sidebar for mobile */}
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <h4>Filter Tasks</h4>
        <ul>
          <li 
            className={activeFilter === "This Day" ? "active" : ""} 
            onClick={() => handleFilterClick("This Day")}
          >
            <FaCalendarDay className="sidebar-icon" /> This Day
          </li>
          <li 
            className={activeFilter === "This Week" ? "active" : ""} 
            onClick={() => handleFilterClick("This Week")}
          >
            <FaCalendarWeek className="sidebar-icon" /> This Week
          </li>
          <li 
            className={activeFilter === "This Month" ? "active" : ""} 
            onClick={() => handleFilterClick("This Month")}
          >
            <FaCalendarAlt className="sidebar-icon" /> This Month
          </li>
          <li 
            className={activeFilter === "Completed" ? "active" : ""} 
            onClick={() => handleFilterClick("Completed")}
          >
            <FaCheckCircle className="sidebar-icon" /> Completed Tasks
          </li>
          <li 
            className={activeFilter === "Due Tasks" ? "active" : ""} 
            onClick={() => handleFilterClick("Due Tasks")}
          >
            <FaExclamationTriangle className="sidebar-icon" /> Due Tasks
          </li>
          <li 
            className={activeFilter === "All" ? "active" : ""} 
            onClick={() => handleFilterClick("All")}
          >
            <FaList className="sidebar-icon" /> All Tasks
          </li>
        </ul>
      </div>

      <div className="task-container">
        {/* Profile Component - Positioned in top right */}
        <div className="profile-container">
          <Profile 
            onLogin={handleLogin} 
            onLogout={handleLogout} 
          />
        </div>

        <h2 className="app-header">My Task Manager</h2>
        
        {/* Search Bar */}
        <Form className="search-bar">
          <div className="search-container">
            <Form.Control
              type="text"
              placeholder="Search for tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-bar-icon">🔍</span>
          </div>
        </Form>

        {user ? (
          <>
            <div className="task-input-container" onClick={handleShowModal}>
              <span className="task-input-icon">+</span>
              <input type="text" placeholder="Add a Task" className="task-input-field" readOnly />
            </div>

            <div className="task-list-wrapper">
              <ListGroup className="task-list mt-4">
                <div className="task-list-container">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <ListGroup.Item
                        key={task._id}
                        className={`${task.completed ? "completed-task" : "task-item"} wide-list-item`}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div onClick={() => toggleTaskCompletion(task._id)}>
                            <Form.Check
                              type="checkbox"
                              label={task.title}
                              checked={task.completed}
                              readOnly
                            />
                            <p className="task-description">{task.description}</p>
                            <small className="task-time">
                              Due: {moment(task.dueDate).format("YYYY-MM-DD HH:mm")}
                            </small>
                          </div>
                          <div>
                            <button
                              className="icon-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTask(task);
                                handleShowModal();
                              }}
                            >
                              <FaEdit className="task-icon" />
                            </button>
                            <button
                              className="icon-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(task._id);
                              }}
                            >
                              <FaTrash className="task-icon" />
                            </button>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <p className="no-tasks-message">No tasks found</p>
                  )}
                </div>
              </ListGroup>
            </div>

            <TaskModal
              show={showModal}
              onHide={() => {
                setShowModal(false);
                setSelectedTask(null);
              }}
              addTask={addTask}
              updateTask={updateTask}
              selectedTask={selectedTask}
              user={user}
            />
          </>
        ) : (
          <div className="login-prompt mt-4">
            <p>Please log in to view and manage your tasks.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
