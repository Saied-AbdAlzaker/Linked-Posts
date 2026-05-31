import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import MainLayout from './layout/MainLayout'
import Feed from './pages/Feed'
import PostDetails from './pages/PostDetails'
import AuthLayout from './layout/AuthLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import AuthContextProvider from './Context/AuthContext'
import ProutectedRoute from './components/ProtectedRoutes/ProutectedRoute'
import AuthProtectedRoute from './components/ProtectedRoutes/AuthProtectedRoute'
import Profile from './pages/Profile'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const routers = createBrowserRouter([
  {
    path: '', element: <MainLayout />, children: [
      { index: true, element: <ProutectedRoute><Feed /></ProutectedRoute> },
      { path: 'post-details/:id', element: <ProutectedRoute><PostDetails /></ProutectedRoute> },
      { path: 'profile', element: <ProutectedRoute><Profile /></ProutectedRoute> },
    ]
  },
  {
    path: 'auth', element: <AuthLayout />, children: [
      { path: 'login', element: <AuthProtectedRoute><Login /></AuthProtectedRoute> },
      { path: 'register', element: <AuthProtectedRoute><Register /></AuthProtectedRoute> },
    ]
  }
])

export const queryClient = new QueryClient();

function App() {

  return <>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <AuthContextProvider>
        <HeroUIProvider>
          <ToastProvider placement='top-right' />
          <RouterProvider router={routers}></RouterProvider>
        </HeroUIProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </>
}

export default App
