import { useState, useCallback } from 'react'

export const useWorkflowStore = () => {
  const [selectedNode, setSelectedNode] = useState(null)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, ...newData },
          }
        }
        return node
      })
    )
  }, [])

  const addNode = useCallback((newNode) => {
    setNodes((nds) => [...nds, newNode])
  }, [])

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId))
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
  }, [])

  const addEdge = useCallback((newEdge) => {
    setEdges((eds) => [...eds, newEdge])
  }, [])

  const deleteEdge = useCallback((edgeId) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId))
  }, [])

  return {
    selectedNode,
    setSelectedNode,
    nodes,
    setNodes,
    edges,
    setEdges,
    updateNodeData,
    addNode,
    deleteNode,
    addEdge,
    deleteEdge,
  }
}
