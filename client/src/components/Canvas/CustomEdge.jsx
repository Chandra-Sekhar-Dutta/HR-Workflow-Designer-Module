import React from 'react'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react'

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, data }) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const onEdgeClick = (evt) => {
    evt.stopPropagation()
    if (window.confirm('Delete this connection?')) {
      // Edge deletion is handled by ReactFlow's onEdgesDelete
      if (data?.onDelete) {
        data.onDelete(id)
      }
    }
  }

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button
            className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-red-500 hover:bg-red-50 transition-colors cursor-pointer shadow-sm"
            onClick={onEdgeClick}
            title="Delete connection"
          >
            <svg className="w-3 h-3 text-gray-500 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default CustomEdge
