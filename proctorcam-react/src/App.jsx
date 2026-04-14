import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import TestPage from './pages/TestPage'
import ResultsPage from './pages/ResultsPage'
import DashboardPage from './pages/DashboardPage'
import TestPortalPage from './pages/TestPortalPage'
import AdminDashboardPage from './pages/AdminDashboardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/test" element={<TestPortalPage />} />
      <Route path="/test/active" element={<TestPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
    </Routes>
  )
}

export default App
