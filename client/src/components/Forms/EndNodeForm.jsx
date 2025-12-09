import React, { useState } from 'react'

const EndNodeForm = ({ node, onUpdate }) => {
  const [formData, setFormData] = useState({
    label: node.data.label || 'End Node',
    message: node.data.message || 'Workflow completed',
    showSummary: node.data.showSummary || false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(node.id, formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Title
        </label>
        <input
          type="text"
          name="label"
          value={formData.label}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Completion Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="showSummary"
          checked={formData.showSummary}
          onChange={handleChange}
          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
        />
        <label className="ml-2 text-sm text-gray-700">
          Show Workflow Summary
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
      >
        Update End Node
      </button>
    </form>
  )
}

export default EndNodeForm
