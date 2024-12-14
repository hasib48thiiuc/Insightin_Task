import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Auth";
import Home from "./Home";

function PrivateRoute(props) {
  const user = JSON.parse(localStorage.getItem("token"));

  return user ? <Outlet /> : <Navigate to="/"></Navigate>;
}

export default PrivateRoute;
