import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './auth/Signup'
import Dashboard from './components/Dashboard'
import Login from './auth/Login'
import CreateProject from './components/CreateProject'
import ViewProject from './project/ViewProject'
import AddTask from './task/AddTask'
import FavouriteProject from './project/FavouriteProject'

const App = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard/>
    },
    {
      path: "/signup",
      element: <Signup/>
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: '/create-project',
      element: <CreateProject />
    },
    {
      path: '/project/:id',
      element: <ViewProject />
    },
    {
      path: '/project/:id/tasks/add',
      element: <AddTask />
    },
    {
      path: '/favourite/:userId',
      element: <FavouriteProject />
    }

  ])
  return (
    <div>
      <RouterProvider router={appRouter}/>
    </div>
  )
}

export default App
