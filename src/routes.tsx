import Layout from "@components/layout/Layout";
import Login from "@pages/auth/Login";
import SignUp from "@pages/auth/SignUp";
import ErrorPage from "@pages/ErrorPage";
import Home from "@pages/Home";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "auth/login",
        element: <Login />,
      },
      {
        path: "auth/signup",
        element: <SignUp />,
      },
    ],
  },
]);

export default router;
