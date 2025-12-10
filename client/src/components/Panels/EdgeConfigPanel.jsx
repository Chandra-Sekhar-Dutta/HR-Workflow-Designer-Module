import React, { useState } from 'react'

const EdgeConfigPanel = ({ selectedEdge, sourceNode, targetNode, onUpdateEdge, onClose, onDelete }) => {
  const [label, setLabel] = useState(selectedEdge?.data?.label || '')

  if (!selectedEdge) {
    return null
  }

  const handleSave = () => {
    onUpdateEdge(selectedEdge.id, { label: label.trim() })
    onClose()
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this connection?')) {
      onDelete(selectedEdge.id)
      onClose()
    }
  }

  return (
    <div className="fixed md:relative inset-y-0 right-0 w-full sm:w-96 md:w-80 lg:w-96 bg-white border-l border-gray-300 overflow-y-auto shadow-lg md:shadow-none z-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-4 py-3 flex justify-between items-center z-10">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">Connection Configuration</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl p-1"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {/* Connection Info */}
        <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Connection Details</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedEdge.data?.color || '#6b7280' }}></div>
              <span className="text-xs text-gray-600">
                {sourceNode?.data?.label || sourceNode?.type} → {targetNode?.data?.label || targetNode?.type}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              <span className="font-medium">{sourceNode?.type}</span> to <span className="font-medium">{targetNode?.type}</span>
            </div>
          </div>
        </div>

        {/* Label Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Connection Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., Approved, Rejected, Next Step..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Add a descriptive label to identify this connection
          </p>
        </div>

        {/* Preview */}
        {label && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-emerald-800 mb-2">Preview</p>
            <div className="flex items-center justify-center gap-2">
              <div 
                className="px-3 py-1.5 bg-white border rounded shadow-sm text-xs font-medium"
                style={{ color: selectedEdge.data?.color, borderColor: selectedEdge.data?.color }}
              >
                {label}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-4">
          <button
            onClick={handleSave}
            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-sm shadow-sm"
          >
            Save Changes
          </button>
          <button
            onClick={handleDelete}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm shadow-sm"
          >
            Delete Connection
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default EdgeConfigPanel
