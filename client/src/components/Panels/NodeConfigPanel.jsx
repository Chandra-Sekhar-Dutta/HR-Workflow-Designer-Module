import React from 'react'
import StartNodeForm from '../Forms/StartNodeForm'
import TaskNodeForm from '../Forms/TaskNodeForm'
import ApprovalNodeForm from '../Forms/ApprovalNodeForm'
import AutomatedNodeForm from '../Forms/AutomatedNodeForm'
import EndNodeForm from '../Forms/EndNodeForm'

const NodeConfigPanel = ({ selectedNode, onUpdateNode, onClose, onDelete }) => {
  if (!selectedNode) {
    return (
      <div className="fixed md:relative inset-y-0 right-0 w-full sm:w-96 md:w-80 lg:w-96 bg-gray-50 border-l border-gray-300 p-6 shadow-lg md:shadow-none z-50">
        <div className="text-center text-gray-500">
          <p className="text-base sm:text-lg font-semibold mb-2">No Node Selected</p>
          <p className="text-xs sm:text-sm">Click on a node to edit its properties</p>
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
    <div className="fixed md:relative inset-y-0 right-0 w-full sm:w-96 md:w-80 lg:w-96 bg-white border-l border-gray-300 overflow-y-auto shadow-lg md:shadow-none z-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-4 py-3 flex justify-between items-center z-10">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">Node Configuration</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl p-1"
        >
          ×
        </button>
      </div>
      <div className="p-3 sm:p-4">
        <div className="mb-4 p-2 sm:p-3 bg-gray-100 rounded">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-semibold">Type:</span> {selectedNode.type}
              </p>
              <p className="text-xs text-gray-500 mt-1 truncate">
                <span className="font-semibold">ID:</span> {selectedNode.id}
              </p>
            </div>
            <button
              onClick={handleDelete}
              className="px-2 sm:px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors shrink-0"
              title="Delete Node"
            >
              Delete
            </button>
          </div>
        </div>
        {renderForm()}
      </div>
    </div>
  )
}

export default NodeConfigPanel
