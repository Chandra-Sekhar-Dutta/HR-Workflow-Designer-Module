// Validation utility functions

export const validators = {
  validateWorkflow: (nodes, edges) => {
    const errors = []
    const warnings = []

    // Check for start node (must be first)
    const startNodes = nodes.filter((node) => node.type === 'start')
    if (startNodes.length === 0) {
      errors.push('Workflow must have at least one Start node')
    } else if (startNodes.length > 1) {
      errors.push('Workflow should have only one Start node')
    } else {
      // Check if Start node is actually first (has no incoming edges)
      const startNode = startNodes[0]
      const hasIncoming = edges.some((edge) => edge.target === startNode.id)
      if (hasIncoming) {
        errors.push('Start node must be the first node (cannot have incoming connections)')
      }
    }

    // Check for end node
    const endNodes = nodes.filter((node) => node.type === 'end')
    if (endNodes.length === 0) {
      errors.push('Workflow must have at least one End node')
    }

    // Check for unconnected nodes (except start and end)
    nodes.forEach((node) => {
      const hasIncoming = edges.some((edge) => edge.target === node.id)
      const hasOutgoing = edges.some((edge) => edge.source === node.id)

      if (node.type === 'start' && !hasOutgoing) {
        errors.push(`Start node "${node.data.label}" has no outgoing connections`)
      } else if (node.type === 'end' && !hasIncoming) {
        errors.push(`End node "${node.data.label}" has no incoming connections`)
      } else if (node.type !== 'start' && node.type !== 'end') {
        if (!hasIncoming) {
          errors.push(`Node "${node.data.label}" has no incoming connections`)
        }
        if (!hasOutgoing) {
          errors.push(`Node "${node.data.label}" has no outgoing connections`)
        }
      }
    })

    // Check for cycles (basic check)
    const visited = new Set()
    const recursionStack = new Set()

    const hasCycle = (nodeId) => {
      visited.add(nodeId)
      recursionStack.add(nodeId)

      const outgoingEdges = edges.filter((edge) => edge.source === nodeId)
      for (const edge of outgoingEdges) {
        if (!visited.has(edge.target)) {
          if (hasCycle(edge.target)) return true
        } else if (recursionStack.has(edge.target)) {
          return true
        }
      }

      recursionStack.delete(nodeId)
      return false
    }

    if (startNodes.length > 0) {
      if (hasCycle(startNodes[0].id)) {
        errors.push('Workflow contains a cycle (circular dependency)')
      }
    }

    return { errors, warnings }
  },

  validateNodeData: (node) => {
    const errors = []

    switch (node.type) {
      case 'start':
        if (!node.data.label || node.data.label.trim() === '') {
          errors.push('Start node must have a title')
        }
        break
      case 'task':
        if (!node.data.label || node.data.label.trim() === '') {
          errors.push('Task node must have a title')
        }
        if (!node.data.assignee || node.data.assignee.trim() === '') {
          errors.push('Task node must have an assignee')
        }
        break
      case 'approval':
        if (!node.data.label || node.data.label.trim() === '') {
          errors.push('Approval node must have a title')
        }
        if (!node.data.approverRole || node.data.approverRole.trim() === '') {
          errors.push('Approval node must have an approver role')
        }
        break
      case 'automated':
        if (!node.data.label || node.data.label.trim() === '') {
          errors.push('Automated node must have a title')
        }
        if (!node.data.action) {
          errors.push('Automated node must have an action selected')
        }
        break
      case 'end':
        if (!node.data.label || node.data.label.trim() === '') {
          errors.push('End node must have a title')
        }
        break
    }

    return errors
  },
}

