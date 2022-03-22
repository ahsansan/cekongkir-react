import Register from "../components/Register";
import Login from "../components/Login";
import { useState } from "react";
import "../styles/auth.css";

export default () => {
  const [inLogin, setInLogin] = useState(true);
  const handleRegister = () => setInLogin(!inLogin);

  return (
    <div className="auth-container">
      <div className="auth-form">{inLogin ? <Login /> : <Register />}</div>
      <div>
        <span className="switch-auth" onClick={handleRegister}>
          {inLogin
            ? "Don't have an account? Click Here"
            : "Already have an account? Click Here"}
        </span>
      </div>
    </div>
  );
};
