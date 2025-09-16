import { useEffect, useState } from "react";
import {
  LoginFormData,
  validateLoginForm,
  ValidationErrors,
} from "./Validations";
import { loginUser } from "./Services";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../ContextApi/AuthContext/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { users, setUsers } = useAuth();
  const storedData = localStorage.getItem("UserData");
  const userData = storedData ? JSON.parse(storedData) : null;

  useEffect(() => {
    if (users && userData) {
      navigate("/dashBoard", { replace: true });
    }
  }, [navigate, userData]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateLoginForm(formData);
    if (Object.keys(errors).length === 0) {
      try {
        const response = await loginUser(formData);
        if (response.status === 201 || response.status === 200) {
          const { access_token, user } = response.data;
          const combinedData = {
            access_token,
            user,
            refresh_token: response.data.refresh,
          };
          localStorage.setItem("UserData", JSON.stringify(combinedData));
          setUsers(combinedData);
          setTimeout(() => navigate("/dashBoard", { replace: true }), 100);
          setFormData({ email: "", password: "" });
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    } else {
      setErrors(errors);
    }
  };

  return (
    <div className="sign_wrapper">
      <div className="row mx-0">
        <div className="col-12 col-sm-12 col-lg-12">
          <div className="sign_body">
            <form onSubmit={handleSubmit}>
              <div className="sign_in_form">
                <h2 className="font_30 font_600 mb-3">Sign in</h2>
                <p className="font_16">ChatWithBooks Sign in using your account with</p>

                <p className="font_16">Or log in with your email address</p>
                <div className="mb-3">
                  <label htmlFor="sign_email" className="form-label d-none">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="sign_email"
                    placeholder="Email address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="text-danger mt-1">{errors.email}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="sign_password" className="form-label d-none">
                    Password
                  </label>
                  <input
                    className="form-control"
                    id="sign_password"
                    placeholder="Password"
                    type="password"
                    autoComplete="current-password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <div className="text-danger mt-1">{errors.password}</div>
                  )}
                </div>
                <button type="submit" className="btn primary_btn w-100">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
