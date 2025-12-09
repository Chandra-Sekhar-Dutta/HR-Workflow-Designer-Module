import React from 'react'

const NodePalette = () => {
  const nodeTypes = [
    { type: 'start', label: 'Start', color: 'bg-green-500' },
    { type: 'task', label: 'Task', color: 'bg-blue-500' },
    { type: 'approval', label: 'Approval', color: 'bg-yellow-500' },
    { type: 'automated', label: 'Automated', color: 'bg-purple-500' },
    { type: 'end', label: 'End', color: 'bg-red-500' },
  ]

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="w-64 bg-gray-100 border-r border-gray-300 p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Node Palette</h2>
      <p className="text-sm text-gray-600 mb-4">Drag nodes to the canvas</p>
      <div className="space-y-3">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
            className={`${node.color} text-white p-3 rounded-lg cursor-move hover:opacity-80 transition-opacity shadow-md`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{node.icon}</span>
              <span className="font-semibold">{node.label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-gray-700">
          Tip: Drag and drop nodes onto the canvas to build your workflow
        </p>
      </div>
    </div>
  )
}

export default NodePalette
