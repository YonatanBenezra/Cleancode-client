import { useForm } from "react-hook-form";
import axios from "axios";
import GlobalContext from "../../contexts/Global-Context";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import Dropzone from "react-dropzone";

const Registration = () => {
  const { setUser } = useContext(GlobalContext);
  const [error, setError] = useState(null);
  const [uploadedImg, setUploadedImg] = useState(null);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const onFormSubmit = async (userData) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/signup`,
        userData
      );
      setUser(res.data.data.user);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const password = watch("password", "");

  const handleGoogleSuccess = async (response) => {
    try {
      const {
        data: { given_name, family_name, email, picture },
      } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${response.access_token}`,
        },
      });
      const userData = {
        name: `${given_name} ${family_name}`,
        email: email,
        photo: picture,
      };
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login-with-media`,
        userData
      );

      localStorage.setItem("token", res.data.token);
      setUser(res.data.data.user);
      navigate("/");
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleGoogleError = (error) => {
    setError(error.message);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });
  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    formData.append("upload_preset", "cleancode");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/djkdk03mf/image/upload",
        formData
      );
      const photo = response.data.secure_url;
      setValue("photo", photo);
      setUploadedImg(photo);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div
          className="col-md-12 col-10 mx-auto px-4 py-5 rounded-3"
          style={{ backgroundColor: "rgb(38,70,83)" }}
        >
          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                {...register("name", { required: true })}
                type="text"
                name="name"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
              />
              {errors.name && (
                <div className="invalid-feedback">*Name is required</div>
              )}
            </div>
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
                <div className="invalid-feedback">*Email is required</div>
              )}
            </div>
            <div className="mb-3">
              {uploadedImg && (
                <div className="text-center">
                  <img
                    src={uploadedImg}
                    alt="Uploaded"
                    style={{
                      width: "100px",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              )}
              <label htmlFor="imgUrl" className="form-label blog-label">
                Upload Image:
              </label>
              <div>
                <Dropzone onDrop={onDrop} accept="image/*">
                  {({ getRootProps, getInputProps }) => (
                    <div className="dropzone-container" {...getRootProps()}>
                      <input {...getInputProps()} id="imgUrl" />
                      <p className="dropzone-text">
                        Drag and drop an image here, or click to select an image
                      </p>
                    </div>
                  )}
                </Dropzone>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                {...register("password", {
                  required: true,
                  minLength: 8,
                })}
                type="password"
                name="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
              />
              {errors.password && (
                <div className="invalid-feedback">
                  *Password must be at least 8 characters long
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="passwordConfirm" className="form-label">
                Confirm Password
              </label>
              <input
                {...register("passwordConfirm", {
                  required: "Password confirmation is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type="password"
                name="passwordConfirm"
                className={`form-control ${
                  errors.passwordConfirm ? "is-invalid" : ""
                }`}
              />
              {errors.passwordConfirm && (
                <div className="invalid-feedback">
                  *{errors.passwordConfirm.message}
                </div>
              )}
            </div>
            <div className="d-flex justify-content-center align-items-center gap-3">
              <button type="submit" className="btn login-btn">
                Register with Email
              </button>
              <button
                type="button"
                className="btn login-btn"
                onClick={() => googleLogin()}
              >
                Register with Google
              </button>
            </div>
          </form>
          <p className="text-center mt-2">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--third-color)" }}>
              Log in here
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
