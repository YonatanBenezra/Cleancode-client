import App from "./App";
import ReactDOM from "react-dom/client";
import React from "react";
import { GlobalProvider } from "./contexts/Global-Context";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Modal from "react-modal";

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
import Auth from "./components/auth/Auth";


Modal.setAppElement(document.getElementById("root"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Auth />} />
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
    </GlobalProvider>
  </React.StrictMode>
);
