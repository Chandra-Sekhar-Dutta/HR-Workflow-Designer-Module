/**
 * Lightweight Mock API Layer for HR Workflow Designer
 * Simulates GET /automations endpoint
 */

export const automationApi = {
  /**
   * GET /automations
   * Returns mock automated actions with their parameters
   */
  getAutomations: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      success: true,
      data: [
        { 
          id: 'send_email', 
          label: 'Send Email', 
          params: ['to', 'subject', 'body'] 
        },
        { 
          id: 'generate_doc', 
          label: 'Generate Document', 
          params: ['template', 'recipient', 'format'] 
        },
        { 
          id: 'create_ticket', 
          label: 'Create Support Ticket', 
          params: ['system', 'priority', 'description'] 
        },
        { 
          id: 'update_database', 
          label: 'Update Database Record', 
          params: ['table', 'field', 'value'] 
        },
        { 
          id: 'notify_slack', 
          label: 'Send Slack Notification', 
          params: ['channel', 'message', 'urgency'] 
        },
        { 
          id: 'schedule_meeting', 
          label: 'Schedule Meeting', 
          params: ['attendees', 'date', 'duration'] 
        },
        { 
          id: 'assign_task', 
          label: 'Assign Task', 
          params: ['assignee', 'task_name', 'deadline'] 
        },
        { 
          id: 'generate_report', 
          label: 'Generate Report', 
          params: ['report_type', 'date_range', 'format'] 
        },
      ]
    }
  },

  /**
   * Legacy method for backward compatibility
   * Maps new format to old component expectations
   */
  getAutomationActions: async () => {
    const response = await automationApi.getAutomations()
    
    // Transform to legacy format for existing components
    return response.data.map(action => ({
      value: action.id,
      label: action.label,
      parameters: action.params.map(param => ({
        key: param,
        label: param.charAt(0).toUpperCase() + param.slice(1).replace('_', ' '),
        placeholder: `Enter ${param.replace('_', ' ')}`
      }))
    }))
  },
}
