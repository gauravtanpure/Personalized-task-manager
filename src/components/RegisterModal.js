import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

const RegisterModal = ({ show, onHide, onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Make the registration request
      const response = await axios.post(
        "https://task-manager-jdut.onrender.com/api/users/register", 
        { email, password, name }
      );
      
      // Debugging: Log the response from the backend
      console.log("Registration response:", response.data);

      // Store the token and user in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Debugging: Log the stored token and user
      console.log("Token stored in localStorage:", localStorage.getItem("token"));
      console.log("User stored in localStorage:", localStorage.getItem("user"));

      // Pass user data to the parent component (App.js)
      onRegister(response.data);
      
      // Reset the form fields
      setEmail("");
      setPassword("");
      setName("");
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.message || 
        "Error registering user. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Display error message if there's an error */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Registration form */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </Form.Group>

          {/* Submit button */}
          <Button 
            type="submit" 
            className="mt-3"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterModal;
