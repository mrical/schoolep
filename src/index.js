import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createHashRouter, Navigate, RouterProvider,
} from "react-router-dom";
import App from './App';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorPage from './error-page';
import './index.css';



//importovane pages (stranky)
import Home from './pages/Home/Home';

import Login from './pages/Login/Login';
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
import Call from './pages/Call/Call';




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
    path: "/room/:id",
    element: 
    <PrivateRoute>
    <App>
      <Notes>
        <Call />
      </Notes>
    </App>
  </PrivateRoute>
  },
  {
    path: "/login",
    element: <Login />
  }, 
  {
    path: "/signup",
    element: <Signup />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
       <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);