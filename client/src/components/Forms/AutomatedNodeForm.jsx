import React, { useState, useEffect } from 'react'
import { automationApi } from '../../api/automationApi'

const AutomatedNodeForm = ({ node, onUpdate }) => {
  const [automationActions, setAutomationActions] = useState([])
  const [formData, setFormData] = useState({
    label: node.data.label || 'Automated Node',
    action: node.data.action || '',
    parameters: node.data.parameters || {},
  })

  useEffect(() => {
    // Fetch automation actions
    const actions = automationApi.getAutomationActions()
    setAutomationActions(actions)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleParameterChange = (key, value) => {
    setFormData({
      ...formData,
      parameters: { ...formData.parameters, [key]: value },
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(node.id, formData)
  }

  const selectedAction = automationActions.find(a => a.value === formData.action)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Automation Title
        </label>
        <input
          type="text"
          name="label"
          value={formData.label}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Automation Action
        </label>
        <select
          name="action"
          value={formData.action}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select an action</option>
          {automationActions.map((action) => (
            <option key={action.value} value={action.value}>
              {action.label}
            </option>
          ))}
        </select>
      </div>
      {selectedAction && selectedAction.parameters && (
        <div className="space-y-3 p-3 bg-purple-50 rounded-md">
          <h4 className="text-sm font-semibold text-gray-700">Parameters</h4>
          {selectedAction.parameters.map((param) => (
            <div key={param.key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {param.label}
              </label>
              <input
                type="text"
                value={formData.parameters[param.key] || ''}
                onChange={(e) => handleParameterChange(param.key, e.target.value)}
                placeholder={param.placeholder}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}
        </div>
      )}
      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
      >
        Update Automation
      </button>
    </form>
  )
}

export default AutomatedNodeForm
