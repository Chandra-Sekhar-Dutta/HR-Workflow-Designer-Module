import React, { useCallback, useRef, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import CustomEdge from './CustomEdge'

const WorkflowCanvas = ({ 
  nodeTypes, 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect: onConnectProp,
  onNodeClick,
  onAddNode
}) => {
  const reactFlowWrapper = useRef(null)

  const edgeTypes = useMemo(
    () => ({
      custom: CustomEdge,
    }),
    []
  )

  const handleConnect = useCallback(
    (params) => {
      if (onConnectProp) {
        onConnectProp(params)
      }
    },
    [onConnectProp]
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      if (!type) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 40,
      }

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: type === 'start' ? 'Initiator' : 
                 type === 'end' ? 'End of Workflow' : 
                 type === 'task' ? 'New Task' :
                 type === 'approval' ? 'New Approval' :
                 type === 'automated' ? 'Automated Action' :
                 `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        },
      }

      // Add node via parent handler
      if (onAddNode) {
        onAddNode(newNode)
      }
    },
    [onNodesChange]
  )

  const onNodeClickHandler = useCallback(
    (event, node) => {
      onNodeClick(node)
    },
    [onNodeClick]
  )

  const onPaneClick = useCallback(() => {
    onNodeClick(null)
  }, [onNodeClick])

  return (
    <div ref={reactFlowWrapper} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={onNodeClickHandler}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        className="bg-gray-50"
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Control"
      >
        <Background 
          variant="dots"
          color="#94a3b8"
          gap={20}
          size={1.5}
          className="bg-white"
        />
        <Controls 
          className="bg-white shadow-md rounded-lg" 
          showZoom={true} 
          showFitView={true} 
          showInteractive={true}
        />
      </ReactFlow>
    </div>
  )
}

export default WorkflowCanvas
