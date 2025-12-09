import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react'
import WorkflowCanvas from '../components/Canvas/WorkflowCanvas'
import NodeConfigPanel from '../components/Panels/NodeConfigPanel'
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

  // Get current workspace
  const currentWorkspace = workspaces.find(w => w.id === activeWorkspaceId)
  const nodes = currentWorkspace?.nodes || []
  const edges = currentWorkspace?.edges || []
  const selectedNode = currentWorkspace?.selectedNode || null

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
      type: 'default',
    }
    setWorkspaces(prev => prev.map(w => 
      w.id === activeWorkspaceId ? { ...w, edges: [...w.edges, newEdge] } : w
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
        return {
          ...w,
          nodes: w.nodes.filter(n => n.id !== nodeId),
          edges: w.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
          selectedNode: w.selectedNode?.id === nodeId ? null : w.selectedNode
        }
      }
      return w
    }))
    setTimeout(saveToHistory, 0)
  }, [activeWorkspaceId, saveToHistory])

  // Undo function
  const undo = React.useCallback(() => {
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
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <NavLink to="/" className="text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </NavLink>
          <h1 className="text-lg font-medium text-gray-900">Workflow Name</h1>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-4">
          <button 
            onClick={() => setShowNodePalette(true)}
            className="w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            title="Stages"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
            </svg>
          </button>
          <button 
            onClick={addWorkspace}
            className="w-10 h-10 flex items-center justify-center text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            title="Add Workspace"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Workspace Tabs */}
          <div className="bg-white border-b border-gray-200 flex items-center px-2 overflow-x-auto h-15">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className={`group flex items-center gap-2 px-4 py-3 border-b-2 cursor-pointer transition-colors ${
                  activeWorkspaceId === workspace.id
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-transparent hover:bg-gray-50 text-gray-600'
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
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">Stages</h2>
              </div>
              
              {/* Undo/Redo Buttons */}
              <div className="flex items-center gap-1 border-l pl-4">
                <button
                  onClick={undo}
                  disabled={(historyIndex[activeWorkspaceId] ?? -1) <= 0}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Undo (Ctrl+Z)"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                  </svg>
                </button>
                <button
                  onClick={redo}
                  disabled={(historyIndex[activeWorkspaceId] ?? -1) >= ((history[activeWorkspaceId]?.length ?? 1) - 1)}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show Deleted Stages</span>
                <button
                  onClick={() => setShowDeletedStages(!showDeletedStages)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showDeletedStages ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showDeletedStages ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <button 
                onClick={() => setIsValidationOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Validate
              </button>
              <button 
                onClick={() => setIsSandboxOpen(true)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Live Preview
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-gray-50">
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

          {/* Add Stage Button */}
          <button
            onClick={() => setShowNodePalette(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-red-400 hover:bg-red-500 rounded-full shadow-lg flex items-center justify-center text-white transition-colors"
            title="Add Stage"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
          </button>
        </div>

        {/* Right Sidebar - Node Config Panel */}
        {selectedNode && (
          <NodeConfigPanel
            selectedNode={selectedNode}
            onUpdateNode={handleUpdateNode}
            onClose={handleClosePanel}
            onDelete={() => deleteNode(selectedNode.id)}
          />
        )}
      </div>

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
