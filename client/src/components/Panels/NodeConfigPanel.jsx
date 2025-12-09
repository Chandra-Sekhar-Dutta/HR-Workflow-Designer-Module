import React from 'react'
import StartNodeForm from '../Forms/StartNodeForm'
import TaskNodeForm from '../Forms/TaskNodeForm'
import ApprovalNodeForm from '../Forms/ApprovalNodeForm'
import AutomatedNodeForm from '../Forms/AutomatedNodeForm'
import EndNodeForm from '../Forms/EndNodeForm'

const NodeConfigPanel = ({ selectedNode, onUpdateNode, onClose, onDelete }) => {
  if (!selectedNode) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-300 p-6">
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold mb-2">No Node Selected</p>
          <p className="text-sm">Click on a node to edit its properties</p>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this ${selectedNode.type} node?`)) {
      onDelete()
    }
  }

  const renderForm = () => {
    switch (selectedNode.type) {
      case 'start':
        return <StartNodeForm node={selectedNode} onUpdate={onUpdateNode} />
      case 'task':
        return <TaskNodeForm node={selectedNode} onUpdate={onUpdateNode} />
      case 'approval':
        return <ApprovalNodeForm node={selectedNode} onUpdate={onUpdateNode} />
      case 'automated':
        return <AutomatedNodeForm node={selectedNode} onUpdate={onUpdateNode} />
      case 'end':
        return <EndNodeForm node={selectedNode} onUpdate={onUpdateNode} />
      default:
        return <div>Unknown node type</div>
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-300 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Node Configuration</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Type:</span> {selectedNode.type}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              <span className="font-semibold">ID:</span> {selectedNode.id}
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
            title="Delete Node"
          >
            Delete
          </button>
        </div>
      </div>
      {renderForm()}
    </div>
  )
}

export default NodeConfigPanel
