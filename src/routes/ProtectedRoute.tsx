import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRouteClient() {
  const token = localStorage.getItem("accessTokenClient");
  return token ? <Outlet /> : <Navigate to="/sign-in" replace />;
}

export function ProtectedRouteAdmin() {
  const token = localStorage.getItem("accessTokenAdmin");
  return token ? <Outlet /> : <Navigate to="/admin/sign-in" replace />;
}

