import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './root/Root.tsx'
import Student from './components/Student.tsx'
import Login from './components/Login.tsx'
import StudentSched from './components/student/StudentSched.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/students',
        element: <Student />,
      },
    ],
  },

  {
    path: '/login',
    element: <Login />,
  },

  {
    path: '/student/sched',
    element: <StudentSched />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
