import React, { useCallback, useRef, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Panel,
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
        className="bg-white"
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Control"
      >
        <Background color="#e5e7eb" gap={20} size={1} />
        <Controls 
          className="bg-white shadow-md rounded-lg" 
          showZoom={true} 
          showFitView={true} 
          showInteractive={true}
        />
        <Panel position="top-right" className="bg-white shadow-md rounded-lg p-2 flex gap-2">
          <button
            onClick={() => {
              const rfInstance = reactFlowWrapper.current
              if (rfInstance) {
                // Save workflow logic here
                console.log('Save workflow')
              }
            }}
            className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            title="Save Workflow"
          >
             Save
          </button>
          <button
            onClick={() => {
              if (onNodesChange) {
                nodes.forEach(node => {
                  onNodesChange([{ type: 'remove', id: node.id }])
                })
              }
              if (onEdgesChange) {
                edges.forEach(edge => {
                  onEdgesChange([{ type: 'remove', id: edge.id }])
                })
              }
            }}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium"
            title="Clear Canvas"
          >
             Clear
          </button>
          <button
            onClick={() => {
              // Export as JSON
              const workflow = {
                nodes: nodes,
                edges: edges,
              }
              const dataStr = JSON.stringify(workflow, null, 2)
              const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
              const exportFileDefaultName = 'workflow.json'
              const linkElement = document.createElement('a')
              linkElement.setAttribute('href', dataUri)
              linkElement.setAttribute('download', exportFileDefaultName)
              linkElement.click()
            }}
            className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
            title="Export Workflow"
          >
             Export
          </button>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default WorkflowCanvas
