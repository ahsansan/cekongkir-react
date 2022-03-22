import { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { API, setAuthToken } from "../config/api";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default () => {
  const [, dispatch] = useContext(UserContext);

  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const router = useNavigate();

  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = JSON.stringify(form);

      const response = await API.post("/login", body, config);

      if (response.data.status == "success") {
        const alert = (
          <Alert variant="success" className="py-2">
            Success
          </Alert>
        );
        setMessage(alert);

        setAuthToken(response.data.data.user.token);

        setForm({
          email: "",
          password: "",
        });

        setTimeout(() => {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: response.data.data.user,
          });
        }, 1000);

        router("/");
      } else {
        const alert = (
          <Alert variant="danger" className="py-2">
            Failed
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-2">
          Failed
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  };

  return (
    <div>
      <h2 className="mb-3">Login</h2>
      {/* Alert */}
      {message && message}
      <Form onSubmit={handleOnSubmit} className="mb-3">
        <Form.Group>
          <Form.Control
            className="form-auth-input"
            type="email"
            name="email"
            onChange={handleOnChange}
            value={form.email}
            id="email"
            placeholder="Email"
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            className="form-auth-input"
            type="password"
            name="password"
            onChange={handleOnChange}
            value={form.password}
            id="password"
            placeholder="Password"
          />
        </Form.Group>
        <Button type="submit" className="btn btn-primary">
          Login
        </Button>
      </Form>
    </div>
  );
};
