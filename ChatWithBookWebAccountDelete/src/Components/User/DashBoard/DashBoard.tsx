import { useEffect, useState } from "react";
import { deleteAccountService, GetUserDetails } from "../Services/Services";
import Loading from "../../Page/Loading/Loading";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../ContextApi/AuthContext/AuthContext";

const DashBoard = () => {
  const navigate = useNavigate();
  const {  setUsers } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState({
    username: "",
    avatar: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const response = await GetUserDetails();
      if (response.status === 200 || response.status === 201) {
        setUserDetails({
          username: response.data.username,
          avatar: response.data.avatar,
          email: response.data.email,
          phone: response.data.phone_number || "",
        });
      }
    } catch (error: any) {
      console.error("Error fetchUserDetails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("UserData");
    setUsers(null);
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("⚠️ Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        const response = await deleteAccountService();
        if (response.status === 200 || response.status === 201) {
          localStorage.removeItem("UserData");
          setUsers(null);
          navigate("/login");
        }
      } catch (error) {
        console.error("Delete account error:", error);
        alert("Error: Something went wrong, please try again.");
      }
    }
  };

  return (
    <>
      {isLoading && <Loading />}

      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">ChatWithBooks</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div className="profile-card">
          {!userDetails.avatar ? (
            <img
              src="../../../../assets/images/profile-pic1.jpg"
              alt="User Avatar"
              className="profile-avatar"
            />
          ) : (
            <img
              src={`${import.meta.env.VITE_API_URL}/${userDetails.avatar}`}
              alt="User Avatar"
              className="profile-avatar"
            />
          )}
          <h2 className="profile-username">{userDetails.username}</h2>
          <p className="profile-email">{userDetails.email}</p>
          <p className="profile-phone">{userDetails.phone}</p>

          <button className="delete-btn" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
