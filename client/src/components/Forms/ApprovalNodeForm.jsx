import React, { useState } from 'react'

const ApprovalNodeForm = ({ node, onUpdate }) => {
  const [formData, setFormData] = useState({
    label: node.data.label || 'Approval Node',
    approverRole: node.data.approverRole || '',
    autoApproveThreshold: node.data.autoApproveThreshold || '',
    requiresComment: node.data.requiresComment || false,
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
          Approval Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="label"
          value={formData.label}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Approver Role
        </label>
        <input
          type="text"
          name="approverRole"
          value={formData.approverRole}
          onChange={handleChange}
          placeholder="e.g., Manager, HR Director"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Auto-Approve Threshold (optional)
        </label>
        <input
          type="number"
          name="autoApproveThreshold"
          value={formData.autoApproveThreshold}
          onChange={handleChange}
          placeholder="Enter amount (e.g., 1000)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
        />
        <p className="text-xs text-gray-500 mt-1">Requests below this amount will be auto-approved</p>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="requiresComment"
          checked={formData.requiresComment}
          onChange={handleChange}
          className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
        />
        <label className="ml-2 text-sm text-gray-700">
          Requires Comment
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition-colors"
      >
        Update Approval
      </button>
    </form>
  )
}

export default ApprovalNodeForm
