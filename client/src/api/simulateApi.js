/**
 * Lightweight Mock API Layer for HR Workflow Designer
 * Simulates POST /simulate endpoint
 */

export const simulateApi = {
  /**
   * POST /simulate
   * Accepts workflow JSON and returns a mock step-by-step execution result
   * @param {Object} workflowData - Complete workflow with nodes and edges
   * @returns {Promise<Object>} Execution result with step-by-step details
   */
  simulate: async (workflowData) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Validate workflow data
    if (!workflowData || !workflowData.nodes || workflowData.nodes.length === 0) {
      return {
        success: false,
        error: 'Invalid workflow data: No nodes found',
        executionId: null,
        steps: []
      }
    }

    // Generate execution ID
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Build execution order based on edges
    const executionOrder = buildExecutionOrder(workflowData)
    
    // Mock simulation of workflow execution
    const steps = []
    let currentTime = new Date()
    
    executionOrder.forEach((node, index) => {
      let description = ''
      let output = ''
      let status = 'success'
      let duration = Math.floor(Math.random() * 3000) + 500 // 500ms to 3.5s

      switch (node.type) {
        case 'start':
          description = `Workflow initiated by ${node.data.assignee || 'System'}`
          output = 'Workflow started successfully. All prerequisites validated.'
          duration = 100
          break
          
        case 'task':
          description = `Task "${node.data.label}" assigned to ${node.data.assignee || 'unassigned'}`
          output = `Task created with ID: TASK-${1000 + index}. Notification sent to assignee.`
          break
          
        case 'approval':
          const approver = node.data.approverRole || node.data.assignee || 'Manager'
          description = `Approval requested from ${approver}`
          output = `Approval request sent. Response: Approved by ${approver}. Comments: Looks good to proceed.`
          duration = Math.floor(Math.random() * 2000) + 1000
          break
          
        case 'automated':
          const action = node.data.action || 'automation'
          description = `Executing automated action: ${action}`
          output = getAutomationOutput(action, node.data)
          break
          
        case 'end':
          description = 'Workflow completed successfully'
          output = node.data.message || 'All tasks completed. Workflow terminated gracefully.'
          duration = 100
          break
          
        default:
          description = `Processing ${node.type} node`
          output = 'Step executed successfully'
      }

      // Calculate timestamps
      const stepStartTime = new Date(currentTime)
      currentTime = new Date(currentTime.getTime() + duration)
      const stepEndTime = new Date(currentTime)

      steps.push({
        stepNumber: index + 1,
        nodeId: node.id,
        nodeType: node.type,
        nodeName: node.data.label || node.type,
        description,
        output,
        status,
        duration: `${duration}ms`,
        startTime: stepStartTime.toISOString(),
        endTime: stepEndTime.toISOString(),
        metadata: {
          assignee: node.data.assignee,
          action: node.data.action,
          parameters: node.data.parameters
        }
      })
    })

    const totalDuration = steps.reduce((sum, step) => sum + parseInt(step.duration), 0)

    return {
      success: true,
      executionId,
      workflowName: workflowData.name || 'Untitled Workflow',
      executedAt: new Date().toISOString(),
      totalDuration: `${totalDuration}ms`,
      totalSteps: steps.length,
      status: 'completed',
      steps,
      summary: {
        startNodes: steps.filter(s => s.nodeType === 'start').length,
        taskNodes: steps.filter(s => s.nodeType === 'task').length,
        approvalNodes: steps.filter(s => s.nodeType === 'approval').length,
        automatedNodes: steps.filter(s => s.nodeType === 'automated').length,
        endNodes: steps.filter(s => s.nodeType === 'end').length,
      }
    }
  },
}

/**
 * Helper function to build execution order from workflow graph
 */
function buildExecutionOrder(workflowData) {
  const { nodes, edges } = workflowData
  
  // Simple topological sort based on edges
  const visited = new Set()
  const order = []
  
  // Find start nodes
  const startNodes = nodes.filter(n => n.type === 'start')
  
  if (startNodes.length === 0) {
    // No start node, return all nodes in order
    return nodes
  }
  
  // DFS traversal
  function visit(nodeId) {
    if (visited.has(nodeId)) return
    
    visited.add(nodeId)
    const node = nodes.find(n => n.id === nodeId)
    if (node) {
      order.push(node)
      
      // Find connected nodes
      const outgoingEdges = edges.filter(e => e.source === nodeId)
      outgoingEdges.forEach(edge => visit(edge.target))
    }
  }
  
  // Start from each start node
  startNodes.forEach(node => visit(node.id))
  
  // Add any unvisited nodes (disconnected)
  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      order.push(node)
    }
  })
  
  return order
}

/**
 * Helper function to generate realistic automation outputs
 */
function getAutomationOutput(action, data) {
  const outputs = {
    'send_email': `Email sent successfully to ${data.to || 'recipients'}. Subject: "${data.subject || 'Workflow Notification'}". Message ID: MSG-${Math.floor(Math.random() * 10000)}`,
    'generate_document': `Document generated from template "${data.template || 'default'}". File: workflow_doc_${Date.now()}.pdf. Size: ${Math.floor(Math.random() * 500) + 50}KB`,
    'create_ticket': `Support ticket created in ${data.system || 'Jira'}. Ticket ID: TICKET-${Math.floor(Math.random() * 10000)}. Priority: ${data.priority || 'Medium'}`,
    'update_database': `Database record updated. Table: ${data.table || 'employees'}, Field: ${data.field || 'status'}, New Value: ${data.value || 'updated'}. Rows affected: 1`,
    'notify_slack': `Slack notification sent to ${data.channel || '#general'}. Message delivered at ${new Date().toLocaleTimeString()}. 3 users acknowledged.`,
    'schedule_meeting': `Meeting scheduled with ${data.attendees || '5 attendees'}. Calendar invite sent. Meeting ID: MTG-${Math.floor(Math.random() * 10000)}`,
    'assign_task': `Task assigned to ${data.assignee || 'team member'}. Task: ${data.task_name || 'Review workflow'}. Deadline: ${data.deadline || 'Next week'}`,
    'generate_report': `Report generated: ${data.report_type || 'Summary Report'}. Date range: ${data.date_range || 'Last 30 days'}. Format: ${data.format || 'PDF'}. Ready for download.`,
  }
  
  return outputs[action] || `Automation "${action}" executed successfully. All parameters processed.`
}
