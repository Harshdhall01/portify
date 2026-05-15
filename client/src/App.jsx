import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Builder from './pages/Builder.jsx'
import Preview from './pages/Preview.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/builder" element={<Builder />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}