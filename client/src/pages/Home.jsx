import React from 'react'
import Hero from '../components/Hero'

const Home = () => {
  return (
    <div>
      <Hero />

      {/* Social Proof Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-gray-500 text-sm font-medium mb-8 uppercase tracking-wider">
              Trusted by leading organizations worldwide
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              <div className="text-center text-2xl font-bold text-gray-400">TechCorp</div>
              <div className="text-center text-2xl font-bold text-gray-400">InnovateLabs</div>
              <div className="text-center text-2xl font-bold text-gray-400">GlobalHR</div>
              <div className="text-center text-2xl font-bold text-gray-400">Enterprise Co</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                Get started in <span className="text-emerald-600">minutes</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600">Three simple steps to transform your HR workflows</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="relative">
                <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg">
                    1
                  </div>
                  <div className="mt-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 text-center">Design Your Workflow</h3>
                    <p className="text-sm sm:text-base text-gray-600 text-center">Drag and drop components to create your perfect workflow in our visual designer</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    2
                  </div>
                  <div className="mt-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Test & Validate</h3>
                    <p className="text-gray-600 text-center">Simulate workflows in real-time to ensure everything works perfectly before deployment</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    3
                  </div>
                  <div className="mt-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Deploy & Automate</h3>
                    <p className="text-gray-600 text-center">Launch your workflow and let automation handle the rest while you focus on strategy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Loved by HR teams everywhere
              </h2>
              <p className="text-xl text-gray-600">See what our customers have to say</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"FlowForge HR transformed our onboarding process. What used to take weeks now takes days. Absolutely game-changing!"</p>
                <div className="flex items-center">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="Sarah Johnson" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <p className="font-bold text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">HR Director, TechCorp</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"The visual designer is incredibly intuitive. Our team was up and running in minutes without any training."</p>
                <div className="flex items-center">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Michael Chen" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <p className="font-bold text-gray-900">Michael Chen</p>
                    <p className="text-sm text-gray-600">VP of Operations, GlobalHR</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"Best investment we've made. The ROI was evident within the first month. Highly recommend!"</p>
                <div className="flex items-center">
                  <img 
                    src="https://randomuser.me/api/portraits/women/68.jpg" 
                    alt="Emily Rodriguez" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <p className="font-bold text-gray-900">Emily Rodriguez</p>
                    <p className="text-sm text-gray-600">Chief People Officer, InnovateLabs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home