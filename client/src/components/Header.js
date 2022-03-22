import { useNavigate } from "react-router-dom";
import "../styles/header.css";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default () => {
  const [state, dispatch] = useContext(UserContext);
  const router = useNavigate();

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
  };
  return (
    <div>
      <div className="header-container">
        <div className="header-logo" onClick={() => router("/")}>
          <h3>Cek Ongkir</h3>
        </div>
        <div className="header-menu">
          {state.isLogin === false ? (
            <button className="btn btn-warning" onClick={() => router("/auth")}>
              Login
            </button>
          ) : (
            <button className="btn btn-warning" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
