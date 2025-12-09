import React from 'react'

const NodePalette = ({ isOpen, onClose }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
    // Close modal immediately so drop event can reach canvas
    setTimeout(() => onClose(), 0)
  }

  const nodeTypes = [
    {
      type: 'start',
      label: 'Start Node',
      icon: '▶️',
      description: 'Workflow entry point',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
    },
    {
      type: 'task',
      label: 'Task Node',
      icon: '📋',
      description: 'Human task assignment',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    },
    {
      type: 'approval',
      label: 'Approval Node',
      icon: '✓',
      description: 'Approval step',
      color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    },
    {
      type: 'automated',
      label: 'Automated Step',
      icon: '⚡',
      description: 'System automation',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    },
    {
      type: 'end',
      label: 'End Node',
      icon: '🏁',
      description: 'Workflow completion',
      color: 'bg-red-50 border-red-200 hover:bg-red-100',
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Add Stage</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(80vh-80px)]">
          {nodeTypes.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
              className={`p-4 border-2 rounded-lg cursor-move transition-all ${node.color}`}
            >
              <div>
                <h3 className="font-medium text-gray-900 mb-1">{node.label}</h3>
                <p className="text-sm text-gray-600">{node.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Drag and drop nodes onto the canvas
          </p>
        </div>
      </div>
    </div>
  )
}

export default NodePalette
