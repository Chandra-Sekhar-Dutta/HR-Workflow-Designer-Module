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

  const edgeColor = data?.color || '#6b7280'
  const edgeLabel = data?.label || ''

  const onEdgeClick = (evt) => {
    evt.stopPropagation()
    if (data?.onEdgeClick) {
      data.onEdgeClick(id)
    }
  }

  const onDeleteClick = (evt) => {
    evt.stopPropagation()
    if (window.confirm('Delete this connection?')) {
      if (data?.onDelete) {
        data.onDelete(id)
      }
    }
  }

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ 
          ...style, 
          stroke: edgeColor,
          strokeWidth: 2
        }} 
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan flex items-center gap-2"
        >
          {edgeLabel && (
            <div 
              className="px-2 py-1 bg-white border rounded shadow-sm text-xs font-medium cursor-pointer hover:bg-gray-50"
              style={{ color: edgeColor, borderColor: edgeColor }}
              onClick={onEdgeClick}
              title="Click to edit label"
            >
              {edgeLabel}
            </div>
          )}
          <button
            className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-red-500 hover:bg-red-50 transition-colors cursor-pointer shadow-sm"
            onClick={edgeLabel ? onDeleteClick : onEdgeClick}
            title={edgeLabel ? "Delete connection" : "Click to add label"}
          >
            {edgeLabel ? (
              <svg className="w-3 h-3 text-gray-500 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
            )}
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default CustomEdge
