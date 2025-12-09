// Simulate API functions

export const simulateApi = {
  simulate: (workflowData) => {
    // Mock simulation of workflow execution
    const steps = []
    
    workflowData.nodes.forEach((node, index) => {
      let description = ''
      let output = ''

      switch (node.type) {
        case 'start':
          description = 'Workflow initiated'
          output = 'Started successfully'
          break
        case 'task':
          description = `Task assigned to ${node.data.assignee || 'unassigned'}`
          output = 'Task created and assigned'
          break
        case 'approval':
          description = `Approval requested from ${node.data.approverRole || 'approver'}`
          output = 'Approval granted'
          break
        case 'automated':
          description = `Executing automation: ${node.data.action || 'unknown'}`
          output = 'Automation executed successfully'
          break
        case 'end':
          description = 'Workflow completed'
          output = node.data.message || 'Workflow finished'
          break
        default:
          description = 'Unknown step'
          output = 'Executed'
      }

      steps.push({
        nodeId: node.id,
        nodeName: node.data.label || node.type,
        description,
        output,
        timestamp: new Date().toISOString(),
      })
    })

    return {
      status: 'success',
      executionTime: `${steps.length * 0.5}s`,
      steps,
    }
  },
}
