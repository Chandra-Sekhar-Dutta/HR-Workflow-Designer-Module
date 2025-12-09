import React, { useState } from 'react'

const StartNodeForm = ({ node, onUpdate }) => {
  const [formData, setFormData] = useState({
    label: node.data.label || 'Initiator',
    description: node.data.description || '',
    metadata: node.data.metadata || {},
  })
  const [newMetaKey, setNewMetaKey] = useState('')
  const [newMetaValue, setNewMetaValue] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const addMetadata = () => {
    if (newMetaKey.trim() && newMetaValue.trim()) {
      setFormData({
        ...formData,
        metadata: { ...formData.metadata, [newMetaKey]: newMetaValue },
      })
      setNewMetaKey('')
      setNewMetaValue('')
    }
  }

  const removeMetadata = (key) => {
    const newMetadata = { ...formData.metadata }
    delete newMetadata[key]
    setFormData({ ...formData, metadata: newMetadata })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(node.id, formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Title <span className="text-red-500">*</span>
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
          placeholder="Optional description for workflow start"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* Metadata Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Metadata (Optional Key-Value Pairs)
        </label>
        <div className="space-y-2">
          {Object.entries(formData.metadata).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">{key}:</span>
              <span className="text-sm text-gray-600 flex-1">{value}</span>
              <button
                type="button"
                onClick={() => removeMetadata(key)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Key"
              value={newMetaKey}
              onChange={(e) => setNewMetaKey(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Value"
              value={newMetaValue}
              onChange={(e) => setNewMetaValue(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addMetadata}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        Update Start Node
      </button>
    </form>
  )
}

export default StartNodeForm
