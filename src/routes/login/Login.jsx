import { useForm } from "react-hook-form";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import GlobalContext from "../../contexts/Global-Context";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const { setUser } = useContext(GlobalContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onFormSubmit = async (userInfo) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        userInfo
      );
      localStorage.setItem("token", res.data.token);
      setUser(res.data.data.user);
      navigate("/");

    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleSuccess = async (response) => {
    try {
      const {
        data: { given_name, family_name, email, picture },
      } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${response.access_token}`,
        },
      });
      const userInfo = {
        name: `${given_name} ${family_name}`,
        email: email,
        photo: picture,
      };
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login-with-media`,
        userInfo
      );
      localStorage.setItem("token", res.data.token);

      setUser(res.data.data.user);
      navigate("/");
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleError = (error) => {
    setError(error.message);
  };
  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleError,
  });
  return (
    <div
      className="container my-5 px-4 py-5 rounded-3"
      style={{ backgroundColor: "rgb(38,70,83)" }}
    >
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            {...register("email", { required: true })}
            type="email"
            name="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
          />
          {errors.email && (
            <div className="invalid-feedback">Email is required</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            {...register("password", { required: true })}
            type="password"
            name="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
          {errors.password && (
            <div className="invalid-feedback">Password is required</div>
          )}
        </div>
        <div className="d-flex justify-content-center align-items-center gap-3">
          <button type="submit" className="btn ">
            Login with email
          </button>
          <button type="button" className="btn " onClick={() => login()}>
            Login with Google
          </button>
        </div>
      </form>
      <p className="text-center mt-2">
        Do not have an account?{" "}
        <Link to="/registration" style={{ color: "var(--third-color)" }}>
          Registration here
        </Link>
        .
      </p>
    </div>
  );
};

export default Login;
