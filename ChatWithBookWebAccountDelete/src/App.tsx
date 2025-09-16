import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loading from "./Components/Page/Loading/Loading";
import PageNotFound from "./Components/Page/PageNotFound";
import ProtectedRoutes from "./ProtectedRoutes/ProtectedRoutes";
import Logout from "./Components/Page/Logout";
import DashBoard from "./Components/User/DashBoard/DashBoard";
import Welcome from "./Components/Page/Welcome";
const Login = lazy(() => import("./auth/Login"));

function App() {
  return (
    <>
      <ToastContainer />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/welcome-chatbook" element={<Welcome />} />
          <Route path="/Logout" element={<Logout />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="/dashBoard" element={<DashBoard />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
