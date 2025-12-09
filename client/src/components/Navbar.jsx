import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              FlowForge HR
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-1">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                Contact
              </NavLink>
            </li>
            <li className="ml-4">
              <NavLink 
                to="/workflow-builder"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Get Started
              </NavLink>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => 
                    `block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/about" 
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => 
                    `block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/contact" 
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => 
                    `block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  Contact
                </NavLink>
              </li>
              <li className="pt-2">
                <NavLink 
                  to="/workflow-builder"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-sm font-semibold text-center"
                >
                  Get Started
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar