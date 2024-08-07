import { Navigate, Route, Routes } from "react-router-dom"

import HomePage from "./pages/home/Home.jsx"
import SignupPage from "./pages/auth/signup/Signup.jsx"
import LoginPage from "./pages/auth/login/Login.jsx"
import Profile from "./pages/profile/Profile.jsx"
import NotificationPage from "./pages/notification/Notification.jsx"
import Sidebar from "./components/common/Sidebar.jsx"
import RightPanel from "./components/common/RightPanel.jsx"

import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import LoadingSpinner from "./components/common/LoadingSpinner.jsx"

export default function App() {
 
  const { data: authUser , isLoading } = useQuery({  //use unique name to query to use them later
    queryKey: ['authUser'],
    queryFn: async() => {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json();
        if (data.error) return null
        if (!res.ok || data.error) {
          throw new Error(data.error || "Something went wrong")
        }
        return data
      } catch (error) {
        throw new Error(error)
      }
    },
    retry: false
  }) 

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size='lg'/>
      </div>
      )
  }

  return (
    <>
      <div className='flex max-w-6xl mx-auto'>
          { authUser && <Sidebar />}
          <Routes>
              <Route path="/" element={authUser ? < HomePage /> : <Navigate to="/login"/>} />
              <Route path="/login" element={!authUser ? < LoginPage /> : <Navigate to="/"/>} />
              <Route path="/signup" element={!authUser ? < SignupPage /> : <Navigate to="/"/>} />
              <Route path="/notifications" element={authUser ? < NotificationPage /> : <Navigate to="/login"/>} />
              <Route path="/profile/:username" element={authUser ? < Profile /> : <Navigate to="/login"/>} />
          </Routes>
          { authUser && <RightPanel />}
          <Toaster />
      </div>
    </>
  )
}
