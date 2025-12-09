import React from 'react'
import { Handle, Position } from '@xyflow/react'

const StartNode = ({ data, selected }) => {
  return (
    <div className={`px-6 py-4 shadow-md rounded-lg bg-white border ${
      selected ? 'border-blue-500 shadow-lg' : 'border-gray-200'
    } min-w-[200px]`}>
      <div className="text-center">
        <div className="text-sm font-semibold text-gray-900 mb-2">{data.label || 'Initiator'}</div>
        <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
          {data.assignee || data.role || 'Admin'}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400"
      />
    </div>
  )
}

export default StartNode
