import { Route, Routes } from "react-router-dom"

import HomePage from "./pages/home/Home.jsx"
import SignupPage from "./pages/auth/signup/Signup.jsx"
import LoginPage from "./pages/auth/login/Login.jsx"
import Profile from "./pages/profile/Profile.jsx"
import NotificationPage from "./pages/notification/Notification.jsx"

import Sidebar from "./components/common/Sidebar.jsx"
import RightPanel from "./components/common/RightPanel.jsx"

export default function App() {
  return (
    <>
      <div className='flex max-w-6xl mx-auto'>
          <Sidebar />
          <Routes>
              <Route path="/" element={< HomePage />} />
              <Route path="/login" element={< LoginPage />} />
              <Route path="/signup" element={< SignupPage />} />
              <Route path="/notifications" element={< NotificationPage />} />
              <Route path="/profile/:username" element={< Profile />} />
          </Routes>
          <RightPanel />
      </div>
    </>
  )
}
