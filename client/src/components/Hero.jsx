import React, { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'

const Hero = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const particleCount = 60

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.2
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        ctx.fillStyle = `rgba(16, 185, 129, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 * (1 - distance / 150)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section className="min-h-screen relative overflow-hidden pt-16">
      {/* Animated Canvas Background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
      
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-teal-50/80 to-cyan-50/90 z-0"></div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full filter blur-3xl opacity-60 animate-pulse" style={{animationDuration: '8s'}}></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-teal-400/20 to-cyan-400/20 rounded-full filter blur-3xl opacity-60 animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-300/10 to-cyan-300/10 rounded-full filter blur-3xl opacity-50 animate-pulse" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
      
      <div className="container mx-auto px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Side - Content */}
          <div className="space-y-8 animate-fadeInUp">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-3 md:px-4 py-1.5 md:py-2 bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700 rounded-full text-xs md:text-sm font-semibold shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="truncate">HR Workflow Automation Platform</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Streamline Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  HR Processes
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed font-light">
                Empower your HR team with intelligent workflow automation. Design, deploy, and manage approval workflows with unprecedented ease and efficiency.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
              <NavLink
                to="/workflow-builder"
                className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-base md:text-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
              >
                Start Building Free
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </NavLink>
              <NavLink
                to="/about"
                className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-300 text-gray-800 rounded-xl text-base md:text-lg font-semibold hover:bg-white hover:border-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Know More
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </NavLink>
            </div>
          </div>

          {/* Right Side - Feature Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 animate-fadeInUp" style={{animationDelay: '0.2s'}}>

            {/* Feature Card 1 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">50%</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Faster approval cycles</p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">100%</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Compliance assured</p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">24/7</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Team collaboration</p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Real-time</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Analytics & insights</p>
            </div>

            {/* Large Feature Card */}
            <div className="col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/20 rounded-full filter blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold">Workflow Designer</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Drag-and-drop interface</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">
                  Build complex HR workflows visually with our intuitive designer. No coding required.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 sm:px-3 py-1 bg-white/10 rounded-full text-xs font-medium">Templates</span>
                  <span className="px-2 sm:px-3 py-1 bg-white/10 rounded-full text-xs font-medium">Automation</span>
                  <span className="px-2 sm:px-3 py-1 bg-white/10 rounded-full text-xs font-medium">Testing</span>
                  <span className="px-2 sm:px-3 py-1 bg-white/10 rounded-full text-xs font-medium">Deploy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero