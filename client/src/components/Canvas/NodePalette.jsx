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
      description: 'Workflow entry point',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
    },
    {
      type: 'task',
      label: 'Task Node',
      description: 'Human task assignment',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    },
    {
      type: 'approval',
      label: 'Approval Node',
      description: 'Approval step',
      color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    },
    {
      type: 'automated',
      label: 'Automated Step',
      description: 'System automation',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    },
    {
      type: 'end',
      label: 'End Node',
      description: 'Workflow completion',
      color: 'bg-red-50 border-red-200 hover:bg-red-100',
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-[500px] max-h-[90vh] sm:max-h-[85vh] overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Add Stage</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-500 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="text-xs sm:text-sm font-medium text-blue-800">
              Drag and drop nodes onto the canvas to build your workflow
            </p>
          </div>
        </div>
        
        {/* Node Types */}
        <div className="p-4 sm:p-6 space-y-2.5 sm:space-y-3 overflow-y-auto max-h-[calc(90vh-180px)] sm:max-h-[calc(85vh-180px)]">
          {nodeTypes.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
              className={`p-3.5 sm:p-4 md:p-5 border-2 rounded-lg sm:rounded-xl cursor-move transition-all hover:shadow-md active:scale-95 sm:hover:scale-[1.02] ${node.color}`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
                <div className="text-2xl sm:text-3xl">{node.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1">{node.label}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{node.description}</p>
                </div>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NodePalette
