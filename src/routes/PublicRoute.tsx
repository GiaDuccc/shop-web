import { Navigate, Outlet } from "react-router-dom";

export function PublicRouteClient() {
  const token = localStorage.getItem("accessTokenClient");
  if (!token) {
    return <Outlet />;
  }
  return <Navigate to="/profile" replace />;
}

export function PublicRouteAdmin() {
  const token = localStorage.getItem("accessTokenAdmin");
  if (!token) {
    return <Outlet />;
  }
  return <Navigate to="/admin" replace />;
}