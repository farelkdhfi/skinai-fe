import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../config";
import LoadingScreenRoute from "./LoadingScreenRoute";

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingScreenRoute />;
  
  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : children;
};
export default GuestRoute