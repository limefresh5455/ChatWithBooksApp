import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../ContextApi/AuthContext/AuthContext";
import Loading from "../Components/Page/Loading/Loading";

 
const ProtectedRoutes = () => {
  const { users, loading } = useAuth();

  if (loading) return <Loading />;

  if (!users) return <Navigate to="/" replace />;

 

  return <Outlet />;
};

export default ProtectedRoutes;
