import { Navigate } from "react-router-dom";
import LoadingScreenRoute from "./LoadingScreenRoute";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../config";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingScreenRoute />;
  
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />;
};
export default ProtectedRoute