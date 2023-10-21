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
import EditExercise from "./routes/addExercise/EditExercise";
import Quiz from "./components/quiz/Quiz";
import PrivateRoute from "./utils/PrivateRoute";
import BestCode from "./components/bestCode/BestCode";
import Payment from "./components/quiz/Payment";
import QuizList from "./components/quiz/QuizList";
import { HelmetProvider } from "react-helmet-async";
import Success from "./routes/success/Success";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

Modal.setAppElement(document.getElementById("root"));

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PayPalScriptProvider
      options={{
        clientId:
          "ASwzvZ0KbaaDnwoJvkvh-2ji4bPpJINa5Ywr21vdEPkcdKCHHc0-MOww_rgDW7KesBt1toR56G2HpGYL",
      }}
    >
      <HelmetProvider>
        <GlobalProvider>
          <GoogleOAuthProvider
            clientId={import.meta.env.VITE_APP_GOOGLE_LOGIN_CLIENT_ID}
          >
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<App />}>
                  <Route index element={<Home />} />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute restrictedTo={["admin"]}>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/edit-exercise/:exerciseId"
                    element={
                      <PrivateRoute restrictedTo={["admin"]}>
                        <EditExercise />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/quizzes"
                    element={
                      <PrivateRoute restrictedTo={["admin", "user"]}>
                        <QuizList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/quizzes/:quizId"
                    element={
                      <PrivateRoute restrictedTo={["admin", "user"]}>
                        <Quiz />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/payment/:quizId"
                    element={
                      <PrivateRoute restrictedTo={["admin", "user"]}>
                        <Payment />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute restrictedTo={["admin", "user"]}>
                        <Profile />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/edit-exercise/:exerciseId"
                    element={
                      <PrivateRoute restrictedTo={["admin"]}>
                        <EditExercise />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/add-blog"
                    element={
                      <PrivateRoute restrictedTo={["admin"]}>
                        <AddBlog />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/success" element={<Success />} />
                  <Route path="/best-code" element={<BestCode />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registration" element={<Registration />} />
                  <Route path="/add-exercise" element={<AddExercise />} />
                  <Route path="/get-started" element={<GetStarted />} />
                  <Route path="/blogs" element={<AllBlog />} />
                  <Route path="/blog/:blogId" element={<BlogDetails />} />
                  <Route path="/:language" element={<Topics />} />
                  <Route
                    path="/:language/:topic"
                    element={<TopicExercises />}
                  />
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
      </HelmetProvider>
    </PayPalScriptProvider>
  </React.StrictMode>
);
