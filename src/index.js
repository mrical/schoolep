import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import ErrorPage from "./error-page";
import "./index.css";

//imports pages
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Forgot from "./pages/Forgot/Forgot";
import Settings from "./pages/Settings/Settings";
import Signup from "./pages/Signup/Signup";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import Chat from "./pages/Chat/Chat";
import Note from "./pages/Notes/Note/Note";
import Notes from "./pages/Notes/Notes";
import AllNotes from "./pages/Notes/AllNotes/AllNotes";
import CreateNote from "./pages/Notes/Create/CreateNote";
import Folder from "./pages/Notes/Folder/Folder";
import SchoolepAI from "./pages/SchoolepAI/SchoolepAI";
import Admin from "./pages/Admin/Admin";
import { Elements } from "@stripe/react-stripe-js";
import Pricing from "./pages/Pricing/Pricing";
import { initializeStripe } from "./utilis/initializeStripe";
import { UserIPinfoProvider } from "./context/UserCurrencyContext";

//Path ---- / (routes),,,, hashRouter #

const router = createHashRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <App>
          <Home />
        </App>
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/chat",
    element: (
      <PrivateRoute>
        <App>
          <Chat />
        </App>
      </PrivateRoute>
    ),
  },
  {
    path: "/schoolepai",
    element: (
      <PrivateRoute>
        <App>
          <SchoolepAI />
        </App>
      </PrivateRoute>
    ),
  },
  {
    path: "/notes",
    element: (
      <PrivateRoute>
        <App>
          <Notes>
            <AllNotes />
          </Notes>
        </App>
      </PrivateRoute>
    ),
  },
  {
    path: "/pricing",
    element: (
      <PrivateRoute>
        <App>
          <Pricing />
        </App>
      </PrivateRoute>
    ),
  },
  {
    path: "/notes/create",
    element: (
      <PrivateRoute>
        <App>
          <Notes>
            <CreateNote />
          </Notes>
        </App>
      </PrivateRoute>
    ),
  },
  {
    path: "/notes/note/:uId/:nId",
    element: (
      <PrivateRoute>
        <App>
          <Notes>
            <Note />
          </Notes>
        </App>
      </PrivateRoute>
    ),
  },
  {
    path: "/notes/folder/:uId/:nId",
    element: (
      <PrivateRoute>
        <App>
          <Notes>
            <Folder />
          </Notes>
        </App>
      </PrivateRoute>
    ),
  },

  {
    path: "/settings",
    element: (
      <PrivateRoute>
        <App>
          <Settings />
        </App>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin",

    element: (
      <PrivateRoute>
        <AdminRoute>
          <App>
            <Admin />
          </App>
        </AdminRoute>
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot",
    element: <Forgot />,
  },
]);
const options = {};
const stripePromise = initializeStripe();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserIPinfoProvider>
      <AuthProvider>
        <Elements stripe={stripePromise} options={options}>
          <ChatContextProvider>
            <RouterProvider router={router} />
          </ChatContextProvider>
        </Elements>
      </AuthProvider>
    </UserIPinfoProvider>
  </React.StrictMode>
);
