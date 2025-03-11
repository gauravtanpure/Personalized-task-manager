import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import moment from "moment";

const TaskModal = ({ show, onHide, addTask, updateTask, selectedTask, user }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  useEffect(() => {
    if (selectedTask) {
      setTaskTitle(selectedTask.title);
      setTaskDescription(selectedTask.description);
      setDueDate(moment(selectedTask.dueDate).format("YYYY-MM-DD"));
      setDueTime(moment(selectedTask.dueDate).format("HH:mm"));
    } else {
      setTaskTitle("");
      setTaskDescription("");
      setDueDate("");
      setDueTime("");
    }
  }, [selectedTask]);

  const handleSave = () => {
    if (!user || !user._id) {
      console.error("User is not defined or does not have an _id");
      return;
    }

    const taskData = {
      title: taskTitle,
      description: taskDescription,
      dueDate: `${dueDate}T${dueTime}:00.000Z`,
      completed: false,
      user: user._id, // Associate the task with the logged-in user
    };

    if (selectedTask) {
      updateTask({ ...selectedTask, ...taskData }); // Update existing task
    } else {
      addTask(taskData); // Add new task
    }
  };

  // Determine if we're on a mobile device
  const isMobile = window.innerWidth <= 576;

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered
      fullscreen={isMobile ? true : false} // Use fullscreen modal on mobile
      size={isMobile ? undefined : "lg"} // Use larger size on desktop
    >
      <Modal.Header closeButton>
        <Modal.Title>{selectedTask ? "Edit Task" : "Add New Task"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Task Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Task Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={isMobile ? 2 : 3} // Smaller textarea on mobile
              placeholder="Enter task description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </Form.Group>

          <div className={isMobile ? "" : "d-flex gap-3"}>
            <Form.Group className="mt-3 flex-grow-1">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mt-3 flex-grow-1">
              <Form.Label>Due Time</Form.Label>
              <Form.Control
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </Form.Group>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {selectedTask ? "Update Task" : "Save Task"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskModal;