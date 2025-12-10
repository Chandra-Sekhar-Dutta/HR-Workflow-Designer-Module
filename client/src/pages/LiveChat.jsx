import React, { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NavLink } from 'react-router-dom'

const LiveChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your FlowForge HR assistant. I can help you with questions about our workflow designer, features, and how to use the platform. How can I assist you today?'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const genAI = useRef(null)

  // Initialize Gemini AI
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (apiKey) {
      genAI.current = new GoogleGenerativeAI(apiKey)
    } else {
      console.error('VITE_GEMINI_API_KEY is not set in environment variables')
    }
  }, [])

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // System prompt with website context
  const systemPrompt = `You are a helpful AI assistant for FlowForge HR, an advanced HR workflow designer platform. Your role is to help users understand and use the platform effectively.

PLATFORM OVERVIEW:
FlowForge HR is a comprehensive HR workflow automation platform that allows organizations to design, deploy, and manage HR processes visually using a drag-and-drop interface.

KEY FEATURES:
1. **Visual Workflow Designer**
   - Drag-and-drop node-based interface powered by React Flow
   - Multiple node types: Start, Task, Approval, Automated Action, and End nodes
   - Real-time canvas with zoom, pan, and minimap
   - Multi-workspace support (W1, W2, W3...) for managing multiple workflows simultaneously
   - Undo/Redo functionality with keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)

2. **Node Types**
   - Start Node: Workflow initiator with assignee configuration
   - Task Node: Manual tasks requiring human action
   - Approval Node: Decision points requiring approval from designated users
   - Automated Node: System-triggered actions (emails, notifications, integrations)
   - End Node: Workflow completion marker

3. **Workflow Management**
   - Save and load workflows
   - Clear canvas functionality
   - Delete nodes and connections
   - Node configuration panel for customizing each stage
   - Validation panel to check workflow integrity
   - Live Preview/Sandbox mode to test workflows

4. **User Interface**
   - Professional MongoDB-inspired design with emerald-teal gradient theme
   - Animated particle network background on hero section
   - Glassmorphism navigation bar
   - Responsive design for all devices
   - Dark mode footer with social links

COMMON USE CASES:
- Employee onboarding workflows
- Leave approval processes
- Performance review cycles
- Recruitment pipelines
- Offboarding procedures
- Training and development tracking

HOW TO USE:
1. Navigate to the Workflow Builder from the home page
2. Drag nodes from the palette onto the canvas
3. Connect nodes by dragging from one node's edge to another
4. Click on nodes to configure their properties (assignee, description, etc.)
5. Use the validation panel to ensure workflow is complete
6. Test workflows using the live preview/sandbox mode
7. Create multiple workspaces using the + button for different workflows

KEYBOARD SHORTCUTS:
- Ctrl+Z: Undo last action
- Ctrl+Shift+Z or Ctrl+Y: Redo action
- Delete: Remove selected node/edge

IMPORTANT NOTES:
- Workflows are stored in browser session (not persistent across sessions)
- All features are free to use

When answering questions:
- Be friendly, professional, and concise
- Provide step-by-step instructions when explaining how to do something
- If asked about features not mentioned above, politely state that the feature may not be available yet
- Encourage users to explore the workflow builder hands-on
- For technical issues, suggest checking the GitHub repository or contacting support
- Always maintain a helpful and positive tone

Remember: You are representing FlowForge HR, so be professional but approachable.`

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      if (!genAI.current) {
        throw new Error('API key not configured')
      }

      const model = genAI.current.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      })
      
      // Create conversation history
      const conversationHistory = messages
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n\n')
      
      const fullPrompt = systemPrompt + '\n\nCONVERSATION HISTORY:\n' + conversationHistory + '\n\nUser: ' + userMessage + '\n\nAssistant:'

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt + '\n\nIMPORTANT: Format your response as plain text without any markdown formatting (no *, **, #, -, etc.). Write in a natural, conversational style.' }] }]
      })
      const response = await result.response
      let text = response.text()
      
      // Remove markdown formatting
      text = text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
        .replace(/\*(.*?)\*/g, '$1') // Remove italic *text*
        .replace(/#{1,6}\s/g, '') // Remove headers #
        .replace(/^[-*+]\s/gm, '') // Remove list bullets
        .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Remove code blocks
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links [text](url)

      // Add assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: text }])
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment or contact our support team directly.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="container mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NavLink 
                to="/contact" 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Contact"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </NavLink>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Live Chat Support
                </h1>
                <p className="text-sm text-gray-600">Powered by AI • Available 24/7</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="container mx-auto px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Messages Area */}
            <div className="h-[600px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here... (Press Enter to send)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows="2"
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Instant Responses</h3>
                  <p className="text-xs text-gray-600">Get help in seconds</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Smart Assistant</h3>
                  <p className="text-xs text-gray-600">AI-powered guidance</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">24/7 Available</h3>
                  <p className="text-xs text-gray-600">Always here to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveChat
