import React from 'react'
import { Handle, Position } from '@xyflow/react'

const AutomatedNode = ({ data, selected }) => {
  return (
    <div className={`px-6 py-4 shadow-md rounded-lg bg-white border ${
      selected ? 'border-blue-500 shadow-lg' : 'border-gray-200'
    } min-w-[200px]`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400"
      />
      <div className="text-center space-y-2">
        <div className="text-sm font-semibold text-gray-700">{data.label || 'Automated Action'}</div>
        {data.action && (
          <div className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
            {data.action}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400"
      />
    </div>
  )
}

export default AutomatedNode
