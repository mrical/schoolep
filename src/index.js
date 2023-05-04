import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createHashRouter, RouterProvider,
} from "react-router-dom";
import App from './App';
import { AuthProvider } from './context/AuthContext';
import ErrorPage from './error-page';
import './index.css';



//importovane pages (stranky)
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Forgot from './pages/Forgot/Forgot';
import Settings from './pages/Settings/Settings';
import Signup from './pages/Signup/Signup';
import PrivateRoute from './PrivateRoute';
import Chat from './pages/Chat/Chat';
import Note from './pages/Notes/Note/Note';
import Notes from './pages/Notes/Notes';
import AllNotes from './pages/Notes/AllNotes/AllNotes';
import CreateNote from './pages/Notes/Create/CreateNote';
import Folder from './pages/Notes/Folder/Folder';
import SchoolepAI from './pages/SchoolepAI/SchoolepAI';




//Cesty stranky ---- / (routes),,,, je tam hashRouter #

const router = createHashRouter([
  {
    path: "/",
    element: <PrivateRoute>
      <App>
        <Home />
      </App>
    </PrivateRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/chat",
    element: <PrivateRoute>
      <App>
        <Chat />
      </App>
    </PrivateRoute>,
  },
  {
    path: "/schoolepai",
    element: <PrivateRoute>
      <App>
        <SchoolepAI />
      </App>
    </PrivateRoute>,
  },
  {
    path: "/notes",
    element: <PrivateRoute>
      <App>
        <Notes>
          <AllNotes />
        </Notes>
      </App>
    </PrivateRoute>,
  },
  
  {
    path: "/notes/create",
    element: <PrivateRoute>
      <App>
        <Notes>
          <CreateNote />
        </Notes>
      </App>
    </PrivateRoute>,
  },
  {
    path: "/notes/note/:uId/:nId",
    element: <PrivateRoute>
      <App>
        <Notes>
          <Note />
        </Notes>
      </App>
    </PrivateRoute>,
  },
  {
    path: "/notes/folder/:uId/:nId",
    element: <PrivateRoute>
      <App>
        <Notes>
          <Folder />
        </Notes>
      </App>
    </PrivateRoute>,
  },
  
  {
    path: "/settings",
    element: <PrivateRoute>
      <App>
        <Settings />
      </App>
    </PrivateRoute>,
  },
  {
    path: "/login",
    element: <Login />
  }, 
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/forgot",
    element: <Forgot />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
       <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);