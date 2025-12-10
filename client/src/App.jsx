import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import WorkflowBuilder from './pages/WorkflowBuilder'
import LiveChat from './pages/LiveChat'

const AppContent = () => {
  const location = useLocation()
  const hideFooter = location.pathname === '/workflow-builder'

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact/livechat" element={<LiveChat />} />
          <Route path="/workflow-builder" element={<WorkflowBuilder />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App