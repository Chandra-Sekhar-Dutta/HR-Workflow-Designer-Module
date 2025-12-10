import React, { useState, useEffect, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react'
import WorkflowCanvas from '../components/Canvas/WorkflowCanvas'
import NodeConfigPanel from '../components/Panels/NodeConfigPanel'
import EdgeConfigPanel from '../components/Panels/EdgeConfigPanel'
import SandboxPanel from '../components/Panels/SandboxPanel'
import ValidationPanel from '../components/Panels/ValidationPanel'
import NodePalette from '../components/Canvas/NodePalette'
import { useNodeTypes } from '../hooks/useNodeTypes'

const WorkflowBuilder = () => {
  const nodeTypes = useNodeTypes()
  
  // Workspace management
  const [workspaces, setWorkspaces] = useState([
    {
      id: 1,
      name: 'W1',
      nodes: [{
        id: 'start-initial',
        type: 'start',
        position: { x: 250, y: 50 },
        data: { label: 'Initiator', assignee: 'Admin' },
      }],
      edges: [],
      selectedNode: null,
      selectedEdge: null,
      deletedNodes: [],
    }
  ])
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(1)
  const [workspaceCounter, setWorkspaceCounter] = useState(1)
  
  // Undo/Redo history management
  const [history, setHistory] = useState({})
  const [historyIndex, setHistoryIndex] = useState({})

  
  const [isSandboxOpen, setIsSandboxOpen] = useState(false)
  const [isValidationOpen, setIsValidationOpen] = useState(false)
  const [showDeletedStages, setShowDeletedStages] = useState(false)
  const [showNodePalette, setShowNodePalette] = useState(false)

  // Function to determine edge color based on node types
  const getEdgeColor = React.useCallback((sourceType, targetType) => {
    const colorMap = {
      'start-task': '#10b981',      // emerald
      'start-approval': '#3b82f6',  // blue
      'start-automated': '#8b5cf6', // purple
      'task-task': '#14b8a6',       // teal
      'task-approval': '#f59e0b',   // amber
      'task-automated': '#ec4899',  // pink
      'task-end': '#22c55e',        // green
      'approval-task': '#06b6d4',   // cyan
      'approval-approval': '#6366f1', // indigo
      'approval-automated': '#a855f7', // purple
      'approval-end': '#10b981',    // emerald
      'automated-task': '#f97316',  // orange
      'automated-approval': '#ef4444', // red
      'automated-automated': '#8b5cf6', // violet
      'automated-end': '#84cc16',   // lime
      'start-end': '#6b7280',       // gray
    }
    const key = `${sourceType}-${targetType}`
    return colorMap[key] || '#6b7280' // default gray
  }, [])

  // Save current state to history
  const saveToHistory = React.useCallback(() => {
    const workspace = workspaces.find(w => w.id === activeWorkspaceId)
    if (!workspace) return

    const state = { nodes: workspace.nodes, edges: workspace.edges }
    
    setHistory(prev => {
      const workspaceHistory = prev[activeWorkspaceId] || []
      const currentIndex = historyIndex[activeWorkspaceId] ?? -1
      // Remove any future states if we're not at the end
      const newHistory = workspaceHistory.slice(0, currentIndex + 1)
      // Add new state
      newHistory.push(state)
      // Limit history to 50 states
      if (newHistory.length > 50) newHistory.shift()
      return { ...prev, [activeWorkspaceId]: newHistory }
    })
    
    setHistoryIndex(prev => ({
      ...prev,
      [activeWorkspaceId]: Math.min((prev[activeWorkspaceId] ?? -1) + 1, 49)
    }))
  }, [workspaces, activeWorkspaceId, historyIndex])

  // Update current workspace with useCallback to prevent infinite loops
  const updateWorkspace = React.useCallback((updates) => {
    setWorkspaces(prev => prev.map(w => 
      w.id === activeWorkspaceId ? { ...w, ...updates } : w
    ))
  }, [activeWorkspaceId])

  // Get current workspace
  const currentWorkspace = workspaces.find(w => w.id === activeWorkspaceId)
  const nodes = currentWorkspace?.nodes || []
  const selectedNode = currentWorkspace?.selectedNode || null
  const selectedEdge = currentWorkspace?.selectedEdge || null

  // Prepare edges with callbacks using useMemo
  const edges = React.useMemo(() => {
    const rawEdges = currentWorkspace?.edges || []
    return rawEdges.map(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source)
      const targetNode = nodes.find(n => n.id === edge.target)
      const edgeColor = getEdgeColor(sourceNode?.type, targetNode?.type)
      
      return {
        ...edge,
        type: 'custom',
        data: {
          ...edge.data,
          label: edge.data?.label || '',
          color: edgeColor,
          onEdgeClick: (edgeId) => {
            const foundEdge = rawEdges.find(e => e.id === edgeId)
            if (foundEdge) {
              updateWorkspace({ selectedEdge: foundEdge, selectedNode: null })
            }
          },
          onDelete: (edgeId) => {
            setWorkspaces(prev => prev.map(w => 
              w.id === activeWorkspaceId ? { ...w, edges: w.edges.filter(e => e.id !== edgeId) } : w
            ))
            setTimeout(saveToHistory, 0)
          },
        }
      }
    })
  }, [currentWorkspace?.edges, nodes, activeWorkspaceId, getEdgeColor, updateWorkspace, saveToHistory])

  // Add new workspace
  const addWorkspace = () => {
    const newCounter = workspaceCounter + 1
    const newWorkspace = {
      id: Date.now(),
      name: `W${newCounter}`,
      nodes: [{
        id: `start-initial-${Date.now()}`,
        type: 'start',
        position: { x: 250, y: 50 },
        data: { label: 'Initiator', assignee: 'Admin' },
      }],
      edges: [],
      selectedNode: null,
      selectedEdge: null,
      deletedNodes: [],
    }
    setWorkspaces([...workspaces, newWorkspace])
    setActiveWorkspaceId(newWorkspace.id)
    setWorkspaceCounter(newCounter)
  }

  // Close workspace
  const closeWorkspace = (workspaceId) => {
    if (workspaces.length === 1) return // Don't close last workspace
    const newWorkspaces = workspaces.filter(w => w.id !== workspaceId)
    setWorkspaces(newWorkspaces)
    if (activeWorkspaceId === workspaceId) {
      setActiveWorkspaceId(newWorkspaces[0].id)
    }
  }

  const onNodesChange = React.useCallback((changes) => {
    // Skip saving history for select changes
    const shouldSaveHistory = changes.some(c => 
      c.type !== 'select' && c.type !== 'dimensions'
    )
    
    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspaceId) {
        return { ...w, nodes: applyNodeChanges(changes, w.nodes) }
      }
      return w
    }))
    
    if (shouldSaveHistory) {
      setTimeout(saveToHistory, 0)
    }
  }, [activeWorkspaceId, saveToHistory])

  const addNode = React.useCallback((newNode) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspaceId) {
        return { ...w, nodes: [...w.nodes, newNode] }
      }
      return w
    }))
    setTimeout(saveToHistory, 0)
  }, [activeWorkspaceId, saveToHistory])

  const onEdgesChange = React.useCallback((changes) => {
    const shouldSaveHistory = changes.some(c => c.type !== 'select')
    
    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspaceId) {
        return { ...w, edges: applyEdgeChanges(changes, w.edges) }
      }
      return w
    }))
    
    if (shouldSaveHistory) {
      setTimeout(saveToHistory, 0)
    }
  }, [activeWorkspaceId, saveToHistory])

  const onConnect = React.useCallback((connection) => {
    const newEdge = {
      id: `e${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      type: 'custom',
      data: {
        label: '',
      },
    }
    setWorkspaces(prev => prev.map(w => 
      w.id === activeWorkspaceId ? { ...w, edges: [...w.edges, newEdge] } : w
    ))
    setTimeout(saveToHistory, 0)
  }, [activeWorkspaceId, saveToHistory])

  // Update edge data
  const updateEdgeData = React.useCallback((edgeId, newData) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspaceId) {
        return {
          ...w,
          edges: w.edges.map(edge => 
            edge.id === edgeId 
              ? { ...edge, data: { ...edge.data, ...newData } } 
              : edge
          )
        }
      }
      return w
    }))
    setTimeout(saveToHistory, 0)
  }, [activeWorkspaceId, saveToHistory])

  // Close edge panel
  const handleCloseEdgePanel = React.useCallback(() => {
    updateWorkspace({ selectedEdge: null })
  }, [updateWorkspace])

  // Delete edge (used by EdgeConfigPanel)
  const deleteEdge = React.useCallback((edgeId) => {
    setWorkspaces(prev => prev.map(w => 
      w.id === activeWorkspaceId ? { ...w, edges: w.edges.filter(e => e.id !== edgeId) } : w
    ))
    setTimeout(saveToHistory, 0)
  }, [activeWorkspaceId, saveToHistory])

  const handleSetSelectedNode = React.useCallback((node) => {
    updateWorkspace({ selectedNode: node })
  }, [updateWorkspace])

  const updateNodeData = React.useCallback((nodeId, newData) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspaceId) {
        return {
          ...w,
          nodes: w.nodes.map(node => 
            node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
          )
        }
      }
      return w
    }))
  }, [activeWorkspaceId])

  const handleNodeClick = React.useCallback((node) => {
    handleSetSelectedNode(node)
  }, [handleSetSelectedNode])

  const handleUpdateNode = React.useCallback((nodeId, newData) => {
    updateNodeData(nodeId, newData)
    handleSetSelectedNode(null)
  }, [updateNodeData, handleSetSelectedNode])

  const handleClosePanel = React.useCallback(() => {
    handleSetSelectedNode(null)
  }, [handleSetSelectedNode])

  const addStage = (type) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 250, y: nodes.length * 150 + 50 },
      data: {
        label: type === 'start' ? 'Initiator' : type === 'end' ? 'End of Workflow' : 'New Stage',
      },
    }
    setNodes([...nodes, newNode])
  }

  const deleteNode = React.useCallback((nodeId) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspaceId) {
        const nodeToDelete = w.nodes.find(n => n.id === nodeId)
        const deletedEdges = w.edges.filter(e => e.source === nodeId || e.target === nodeId)
        
        return {
          ...w,
          nodes: w.nodes.filter(n => n.id !== nodeId),
          edges: w.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
          selectedNode: w.selectedNode?.id === nodeId ? null : w.selectedNode,
          deletedNodes: [...(w.deletedNodes || []), {
            node: nodeToDelete,
            edges: deletedEdges,
            deletedAt: Date.now()
          }]
        }
      }
      return w
    }))
    setTimeout(saveToHistory, 0)
  }, [activeWorkspaceId, saveToHistory])

  // Restore deleted node
  const restoreNode = React.useCallback((deletedItem) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspaceId) {
        return {
          ...w,
          nodes: [...w.nodes, deletedItem.node],
          edges: [...w.edges, ...deletedItem.edges],
          deletedNodes: w.deletedNodes.filter(d => d.deletedAt !== deletedItem.deletedAt)
        }
      }
      return w
    }))
    setTimeout(saveToHistory, 0)
  }, [activeWorkspaceId, saveToHistory])

  // Permanently delete a node from deleted list
  const permanentlyDeleteNode = React.useCallback((deletedAt) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspaceId) {
        return {
          ...w,
          deletedNodes: w.deletedNodes.filter(d => d.deletedAt !== deletedAt)
        }
      }
      return w
    }))
  }, [activeWorkspaceId])

  // Export workflow as JSON
  const exportWorkflow = React.useCallback(() => {
    if (!currentWorkspace) return
    
    // Check if canvas is empty
    if (currentWorkspace.nodes.length === 0) {
      alert('⚠️ No nodes in canvas! Please add nodes to your workflow before exporting.')
      return
    }
    
    const workflowData = {
      name: currentWorkspace.name,
      nodes: currentWorkspace.nodes,
      edges: currentWorkspace.edges,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `workflow-${currentWorkspace.name}-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [currentWorkspace])

  // Save workflow function
  const saveWorkflow = React.useCallback(() => {
    if (!currentWorkspace) return
    
    // Check if canvas is empty
    if (currentWorkspace.nodes.length === 0) {
      alert('⚠️ No nodes in canvas! Please add nodes to your workflow before saving.')
      return
    }
    
    // In a real application, this would save to a backend
    // For now, we'll just show a success message
    alert('Workflow saved successfully!')
  }, [currentWorkspace])

  // Clear canvas function
  const clearCanvas = React.useCallback(() => {
    if (!currentWorkspace) return
    
    // Check if canvas has nodes
    if (currentWorkspace.nodes.length === 0) {
      alert('Canvas is already empty!')
      return
    }
    
    // Confirm before clearing
    if (window.confirm('Are you sure you want to clear the entire canvas? This action cannot be undone.')) {
      setWorkspaces(prev => prev.map(w => 
        w.id === activeWorkspaceId 
          ? { ...w, nodes: [], edges: [], selectedNode: null }
          : w
      ))
      setTimeout(saveToHistory, 0)
      alert('Canvas cleared successfully!')
    }
  }, [currentWorkspace, activeWorkspaceId, saveToHistory])

  // Handle Validate button click
  const handleValidate = React.useCallback(() => {
    if (!currentWorkspace) return
    
    // Check if canvas is empty
    if (currentWorkspace.nodes.length === 0) {
      alert('⚠️ Canvas is empty! Please add nodes to your workflow before validating.')
      return
    }
    
    setIsValidationOpen(true)
  }, [currentWorkspace])

  // Handle Live Preview button click
  const handleLivePreview = React.useCallback(() => {
    if (!currentWorkspace) return
    
    // Check if canvas is empty
    if (currentWorkspace.nodes.length === 0) {
      alert('⚠️ Canvas is empty! Please add nodes to your workflow before previewing.')
      return
    }
    
    setIsSandboxOpen(true)
  }, [currentWorkspace])

  // Auto-layout function
  const autoLayout = React.useCallback(() => {
    if (currentWorkspace.nodes.length === 0) {
      alert('⚠️ No nodes in canvas! Please add nodes before using auto-layout.')
      return
    }
    
    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspaceId) {
        const layoutNodes = [...w.nodes]
        const layoutEdges = [...w.edges]
        
        // Build adjacency list
        const adjacencyList = {}
        layoutNodes.forEach(node => {
          adjacencyList[node.id] = []
        })
        layoutEdges.forEach(edge => {
          if (adjacencyList[edge.source]) {
            adjacencyList[edge.source].push(edge.target)
          }
        })
        
        // Find start nodes (nodes with no incoming edges)
        const incomingCount = {}
        layoutNodes.forEach(node => {
          incomingCount[node.id] = 0
        })
        layoutEdges.forEach(edge => {
          incomingCount[edge.target] = (incomingCount[edge.target] || 0) + 1
        })
        
        const startNodes = layoutNodes.filter(node => incomingCount[node.id] === 0)
        
        // BFS to arrange nodes in levels
        const levels = []
        const visited = new Set()
        const queue = startNodes.map(node => ({ node, level: 0 }))
        
        while (queue.length > 0) {
          const { node, level } = queue.shift()
          
          if (visited.has(node.id)) continue
          visited.add(node.id)
          
          if (!levels[level]) levels[level] = []
          levels[level].push(node)
          
          const children = adjacencyList[node.id] || []
          children.forEach(childId => {
            const childNode = layoutNodes.find(n => n.id === childId)
            if (childNode && !visited.has(childId)) {
              queue.push({ node: childNode, level: level + 1 })
            }
          })
        }
        
        // Position nodes
        const horizontalSpacing = 250
        const verticalSpacing = 150
        const startX = 100
        const startY = 100
        
        const positionedNodes = layoutNodes.map(node => {
          let levelIndex = -1
          let positionInLevel = -1
          
          levels.forEach((level, idx) => {
            const pos = level.findIndex(n => n.id === node.id)
            if (pos !== -1) {
              levelIndex = idx
              positionInLevel = pos
            }
          })
          
          if (levelIndex === -1) {
            return node // Keep original position if not found in levels
          }
          
          const levelWidth = levels[levelIndex].length
          const x = startX + positionInLevel * horizontalSpacing
          const y = startY + levelIndex * verticalSpacing
          
          return {
            ...node,
            position: { x, y }
          }
        })
        
        return {
          ...w,
          nodes: positionedNodes
        }
      }
      return w
    }))
    setTimeout(saveToHistory, 0)
  }, [activeWorkspaceId, saveToHistory])

  // Undo function
  const undo = useCallback(() => {
    const workspaceHistory = history[activeWorkspaceId]
    const currentIndex = historyIndex[activeWorkspaceId] ?? -1
    
    if (!workspaceHistory || currentIndex <= 0) return
    
    const newIndex = currentIndex - 1
    const previousState = workspaceHistory[newIndex]
    
    setWorkspaces(prev => prev.map(w => 
      w.id === activeWorkspaceId 
        ? { ...w, nodes: previousState.nodes, edges: previousState.edges }
        : w
    ))
    
    setHistoryIndex(prev => ({ ...prev, [activeWorkspaceId]: newIndex }))
  }, [history, historyIndex, activeWorkspaceId])

  // Redo function
  const redo = React.useCallback(() => {
    const workspaceHistory = history[activeWorkspaceId]
    const currentIndex = historyIndex[activeWorkspaceId] ?? -1
    
    if (!workspaceHistory || currentIndex >= workspaceHistory.length - 1) return
    
    const newIndex = currentIndex + 1
    const nextState = workspaceHistory[newIndex]
    
    setWorkspaces(prev => prev.map(w => 
      w.id === activeWorkspaceId 
        ? { ...w, nodes: nextState.nodes, edges: nextState.edges }
        : w
    ))
    
    setHistoryIndex(prev => ({ ...prev, [activeWorkspaceId]: newIndex }))
  }, [history, historyIndex, activeWorkspaceId])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault()
        undo()
      } else if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key === 'z' || e.key === 'y')) {
        e.preventDefault()
        redo()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  // Initialize history for new workspaces
  useEffect(() => {
    if (!history[activeWorkspaceId]) {
      saveToHistory()
    }
  }, [activeWorkspaceId, history, saveToHistory])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <NavLink to="/" className="text-gray-600 hover:text-gray-900 p-1">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </NavLink>
          <h1 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 truncate">Workflow Name</h1>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden md:flex w-14 lg:w-16 bg-white border-r border-gray-200 flex-col items-center py-3 md:py-4 gap-3 md:gap-4">
          <button 
            onClick={() => setShowNodePalette(true)}
            className="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            title="Stages"
          >
            <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
            </svg>
          </button>
          <button 
            onClick={addWorkspace}
            className="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            title="Add Workspace"
          >
            <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Workspace Tabs */}
          <div className="bg-linear-to-r from-gray-50 to-white border-b border-gray-200 flex items-center px-3 sm:px-4 gap-2 overflow-x-auto scrollbar-hide">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-t-lg cursor-pointer transition-all duration-200 ${
                  activeWorkspaceId === workspace.id
                    ? 'bg-white text-emerald-600 shadow-sm font-semibold border-b-2 border-emerald-500'
                    : 'bg-transparent text-gray-600 hover:bg-white/50 hover:text-gray-900'
                }`}
                onClick={() => setActiveWorkspaceId(workspace.id)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
                </svg>
                <span className="text-sm font-medium whitespace-nowrap">{workspace.name}</span>
                {workspaces.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      closeWorkspace(workspace.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 ml-1 p-0.5 hover:bg-red-100 rounded transition-opacity"
                    title="Close workspace"
                  >
                    <svg className="w-3.5 h-3.5 text-gray-500 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Canvas Header */}
          <div className="bg-white border-b border-gray-200 px-2 sm:px-4 md:px-6 py-2 sm:py-3 flex items-center justify-between shadow-sm overflow-x-auto">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-linear-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
                </svg>
              </div>
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 hidden sm:block">Stages</h2>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Undo/Redo Buttons */}
              <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-100 rounded-lg p-0.5 sm:p-1">
                <button
                  onClick={undo}
                  disabled={(historyIndex[activeWorkspaceId] ?? -1) <= 0}
                  className="p-1.5 sm:p-2 rounded-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all disabled:hover:bg-transparent"
                  title="Undo (Ctrl+Z)"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                  </svg>
                </button>
                <button
                  onClick={redo}
                  disabled={(historyIndex[activeWorkspaceId] ?? -1) >= ((history[activeWorkspaceId]?.length ?? 1) - 1)}
                  className="p-1.5 sm:p-2 rounded-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all disabled:hover:bg-transparent"
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/>
                  </svg>
                </button>
              </div>
              <div className="hidden sm:block w-px h-8 bg-gray-300"></div>
              <button 
                onClick={saveWorkflow}
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all text-xs sm:text-sm font-semibold shadow-sm hover:shadow flex items-center gap-1 sm:gap-2"
                title="Save workflow"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                </svg>
                <span className="hidden sm:inline">Save</span>
              </button>
              <button 
                onClick={exportWorkflow}
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-xs sm:text-sm font-semibold shadow-sm hover:shadow flex items-center gap-1 sm:gap-2"
                title="Export workflow as JSON"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span className="hidden sm:inline">Export</span>
              </button>
              <button 
                onClick={clearCanvas}
                className="hidden sm:flex px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all text-xs sm:text-sm font-semibold shadow-sm hover:shadow items-center gap-1 sm:gap-2"
                title="Clear canvas"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                <span className="hidden md:inline">Clear</span>
              </button>
              <div className="hidden md:block w-px h-8 bg-gray-300 mx-1"></div>
              <button 
                onClick={autoLayout}
                className="hidden lg:flex px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-semibold shadow-sm hover:shadow items-center gap-2"
                title="Automatically arrange nodes"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"/>
                </svg>
                <span>Auto-layout</span>
              </button>
              <button 
                onClick={handleValidate}
                className="hidden md:flex px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs sm:text-sm font-semibold shadow-sm hover:shadow items-center gap-1 sm:gap-2"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="hidden lg:inline">Validate</span>
              </button>
              <button 
                onClick={handleLivePreview}
                className="hidden md:flex px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-xs sm:text-sm font-semibold shadow-sm hover:shadow items-center gap-1 sm:gap-2"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="hidden lg:inline">Preview</span>
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-gray-50 relative">
            <WorkflowCanvas
              key={activeWorkspaceId}
              nodeTypes={nodeTypes}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              onAddNode={addNode}
            />
          </div>
        </div>

        {/* Right Sidebar - Node Config Panel */}
        {selectedNode && (
          <>
            {/* Backdrop for mobile */}
            <div 
              className="fixed inset-0 bg-black/50 md:hidden z-40"
              onClick={handleClosePanel}
            />
            <NodeConfigPanel
              selectedNode={selectedNode}
              onUpdateNode={handleUpdateNode}
              onClose={handleClosePanel}
              onDelete={() => deleteNode(selectedNode.id)}
            />
          </>
        )}

        {/* Right Sidebar - Edge Config Panel */}
        {selectedEdge && !selectedNode && (
          <>
            {/* Backdrop for mobile */}
            <div 
              className="fixed inset-0 bg-black/50 md:hidden z-40"
              onClick={handleCloseEdgePanel}
            />
            <EdgeConfigPanel
              selectedEdge={selectedEdge}
              sourceNode={nodes.find(n => n.id === selectedEdge.source)}
              targetNode={nodes.find(n => n.id === selectedEdge.target)}
              onUpdateEdge={updateEdgeData}
              onClose={handleCloseEdgePanel}
              onDelete={deleteEdge}
            />
          </>
        )}
      </div>

      {/* Deleted Stages Panel */}
      {showDeletedStages && currentWorkspace?.deletedNodes && currentWorkspace.deletedNodes.length > 0 && (
        <div className="fixed bottom-24 right-8 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              <h3 className="font-semibold text-white">Deleted Stages</h3>
            </div>
            <button
              onClick={() => setShowDeletedStages(false)}
              className="text-white hover:bg-white/20 rounded p-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto p-4 space-y-3">
            {currentWorkspace.deletedNodes.map((deletedItem) => (
              <div
                key={deletedItem.deletedAt}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        deletedItem.node.type === 'start' ? 'bg-green-100 text-green-700' :
                        deletedItem.node.type === 'end' ? 'bg-red-100 text-red-700' :
                        deletedItem.node.type === 'task' ? 'bg-blue-100 text-blue-700' :
                        deletedItem.node.type === 'approval' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {deletedItem.node.type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {deletedItem.node.data.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Deleted {new Date(deletedItem.deletedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => restoreNode(deletedItem)}
                    className="flex-1 px-3 py-1.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Restore
                  </button>
                  <button
                    onClick={() => permanentlyDeleteNode(deletedItem.deletedAt)}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors text-xs font-medium"
                    title="Delete permanently"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Node Palette Modal */}
      <NodePalette
        isOpen={showNodePalette}
        onClose={() => setShowNodePalette(false)}
      />

      {/* Validation Panel */}
      <ValidationPanel
        nodes={nodes}
        edges={edges}
        isOpen={isValidationOpen}
        onClose={() => setIsValidationOpen(false)}
      />

      {/* Sandbox Panel */}
      <SandboxPanel
        nodes={nodes}
        edges={edges}
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
      />
    </div>
  )
}

export default WorkflowBuilder
