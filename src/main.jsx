import App from "./App";
import ReactDOM from "react-dom/client";
import React, { Children } from "react";
import { GlobalProvider } from "./contexts/Global-Context";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./routes/home/Home";
import ErrorPage from "./routes/error/ErrorPage";
import AddExercise from "./routes/addExercise/AddExercise";

import Topics from "./routes/topicsExercises/topics/Topics";
import TopicExercises from "./routes/topicsExercises/topicExercises/TopicExercises";
import ExerciseDetails from "./routes/topicsExercises/exerciseDetails/ExerciseDetails";


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
        element: <AddExercise />
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
  // {
  //   path: "/js",
  //   element: <JavaScriptExercises />,
  // },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  </React.StrictMode>
);
