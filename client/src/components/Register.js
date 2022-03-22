import { API } from "../config/api";
import { useState } from "react";
import Swal from "sweetalert2";
import { Form, Button, Alert } from "react-bootstrap";
import "../styles/auth.css";

export default () => {
  // message
  const [message, setMessage] = useState(null);

  // data
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
  });

  // ketika di input
  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ketika tombol submit di tekan
  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault();

      // Config
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Stringify
      const body = JSON.stringify(form);

      // link config
      const response = await API.post("/register", body, config);

      // jika success
      if (response.data.status == "success") {
        // ketika success
        const alert = (
          <Alert variant="success" className="py-2">
            Success
          </Alert>
        );
        setMessage(alert);

        // kosongkan data
        setForm({
          name: "",
          email: "",
          password: "",
        });

        Swal.fire("Good job!", "Registration Success", "success");

        // jika kesalahan inputan
      } else {
        const alert = (
          <Alert variant="danger" className="py-2">
            Failed
          </Alert>
        );
        setMessage(alert);
      }

      // server error
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
    <>
      <h2 className="mb-3">Register</h2>
      {/* alert */}
      {message && message}
      <Form onSubmit={handleOnSubmit} className="mb-3">
        <Form.Group>
          <Form.Control
            className="form-auth-input"
            onChange={handleOnChange}
            value={form.email}
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="false"
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            className="form-auth-input"
            onChange={handleOnChange}
            value={form.name}
            type="text"
            name="name"
            placeholder="Name"
            autoComplete="false"
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            className="form-auth-input"
            onChange={handleOnChange}
            value={form.password}
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </Form.Group>
        <Button className="btn btn-primary" type="submit">
          Register
        </Button>
      </Form>
    </>
  );
};
