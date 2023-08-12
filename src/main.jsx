import App from "./App";
import { createRoot } from "react-dom/client";
import React from "react";
import { GlobalProvider } from "./contexts/Global-Context";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Modal from "react-modal";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./routes/home/Home";
import ErrorPage from "./routes/error/ErrorPage";
import AddExercise from "./routes/addExercise/AddExercise";

import Topics from "./routes/topicsExercises/topics/Topics";
import TopicExercises from "./routes/topicsExercises/topicExercises/TopicExercises";
import ExerciseDetails from "./routes/topicsExercises/exerciseDetails/ExerciseDetails";
import AddBlog from "./routes/addBlog/AddBlog";
import GetStarted from "./routes/getStarted/GetStarted";
import ScrollToTop from "./utils/ScrollToTop";
import AllBlog from "./routes/allBlog/AllBlog";
import BlogDetails from "./routes/blogDetails.jsx/BlogDetails";
import Login from "./routes/login/Login";
import Registration from "./routes/registration/Registration";
import Profile from "./routes/profile/Profile";
import Dashboard from "./routes/dashboard/Dashboard";

Modal.setAppElement(document.getElementById("root"));

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalProvider>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_APP_GOOGLE_LOGIN_CLIENT_ID}
      >
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/add-exercise" element={<AddExercise />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/add-blog" element={<AddBlog />} />
              <Route path="/blogs" element={<AllBlog />} />
              <Route path="/blog/:blogId" element={<BlogDetails />} />
              <Route path="/:language" element={<Topics />} />
              <Route path="/:language/:topic" element={<TopicExercises />} />
              <Route
                path="/:language/:topic/:exerciseNum"
                element={<ExerciseDetails />}
              />
              <Route path="*" element={<ErrorPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </GlobalProvider>
  </React.StrictMode>
);
