import React from 'react'
import { Handle, Position } from '@xyflow/react'

const EndNode = ({ data, selected }) => {
  return (
    <div className={`px-6 py-4 shadow-md rounded-lg bg-white border ${
      selected ? 'border-blue-500 shadow-lg' : 'border-gray-200'
    } min-w-[200px]`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400"
      />
      <div className="text-center">
        <div className="text-sm font-semibold text-gray-700">{data.label || 'End of Workflow'}</div>
      </div>
    </div>
  )
}

export default EndNode
