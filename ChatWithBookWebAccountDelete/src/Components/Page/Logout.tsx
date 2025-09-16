import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../ContextApi/AuthContext/AuthContext";
import Loading from "./Loading/Loading";

const Logout: React.FC = () => {
  const { users, setUsers } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLogout = async () => {
      if (!users) {
        localStorage.clear();
        navigate("/", { replace: true });
        return;
      }
      try {
        localStorage.clear();
        setUsers(null);
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Logout failed:", error);
        localStorage.clear();
        setUsers(null);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    handleLogout();
  }, [navigate, setUsers]);

  if (loading) {
    return <Loading />;
  }

  return null;
};

export default Logout;
