import { Navigate } from "react-router";


export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : children;
};
