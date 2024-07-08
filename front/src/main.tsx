import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import NavBar from './componentes/NavBar.jsx'
import AddPost from './componentes/AddPost.jsx'
import Home from './componentes/Home.jsx'
import CreateUser from './componentes/CreateUser';
import AtualizarPost from './componentes/AttPost.jsx'
import ExcluirPost from './componentes/ExcluirPost.jsx'
import AuthError from './componentes/AuthError.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/navbar',
    element: <NavBar/>
  },
  {
    path: '/addPost',
    element: <AddPost/>
  },
  {
    path:'/home',
    element:<Home/>
  },
  {
    path:'/createUser',
    element:<CreateUser/>
  },
  {
    path:'/auth-error',
    element:<AuthError/>
  },
  {
    path: '/attPost',
    element: <AtualizarPost/>
  },
  {
    path: '/excluirPost',
    element:<ExcluirPost/>
  }
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={routes}/>
)
