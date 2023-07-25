import App from "./App";
import ReactDOM from "react-dom/client";
import React from "react";
import { GlobalProvider } from "./contexts/Global-Context";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Modal from "react-modal";

import Home from "./routes/home/Home";
import ErrorPage from "./routes/error/ErrorPage";
import AddExercise from "./routes/addExercise/AddExercise";

import Topics from "./routes/topicsExercises/topics/Topics";
import TopicExercises from "./routes/topicsExercises/topicExercises/TopicExercises";
import ExerciseDetails from "./routes/topicsExercises/exerciseDetails/ExerciseDetails";
import AddBlog from "./routes/addBlog/AddBlog";
import AllBlog from "./routes/allBlog/allBlog";
import BlogDetails from "./routes/blogDetails.jsx/blogDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <App />, errorElement: <ErrorPage /> },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: ":language",
        element: <Topics />,
      },
      {
        path: ":language/:topic",
        element: <TopicExercises />,
      },
      {
        path: ":language/:topic/:exerciseNum",
        element: <ExerciseDetails />,
      },
      {
        path: "add-exercise",
        element: <AddExercise />,
      },
      {
        path: "add-blog",
        element: <AddBlog />,
      },
      {
        path: "blogs",
        element: <AllBlog />,
      },
      {
        path: "blog/:blogId",
        element: <BlogDetails />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);
Modal.setAppElement(document.getElementById("root"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  </React.StrictMode>
);
