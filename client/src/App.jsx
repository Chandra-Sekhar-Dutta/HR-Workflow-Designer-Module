import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import WorkflowBuilder from './pages/WorkflowBuilder'
import LiveChat from './pages/LiveChat'

const App = () => {
  return (
    <Router>
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
        <Footer />
      </div>
    </Router>
  )
}

export default App