import React, { useState } from 'react'

const TaskNodeForm = ({ node, onUpdate }) => {
  const [formData, setFormData] = useState({
    label: node.data.label || 'Task Node',
    description: node.data.description || '',
    assignee: node.data.assignee || '',
    dueDate: node.data.dueDate || '',
    priority: node.data.priority || 'medium',
    customFields: node.data.customFields || {},
  })
  const [newFieldKey, setNewFieldKey] = useState('')
  const [newFieldValue, setNewFieldValue] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const addCustomField = () => {
    if (newFieldKey.trim() && newFieldValue.trim()) {
      setFormData({
        ...formData,
        customFields: { ...formData.customFields, [newFieldKey]: newFieldValue },
      })
      setNewFieldKey('')
      setNewFieldValue('')
    }
  }

  const removeCustomField = (key) => {
    const newFields = { ...formData.customFields }
    delete newFields[key]
    setFormData({ ...formData, customFields: newFields })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(node.id, formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="label"
          value={formData.label}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assignee
        </label>
        <input
          type="text"
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          placeholder="Enter assignee name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Update Task
      </button>
    </form>
  )
}

export default TaskNodeForm
