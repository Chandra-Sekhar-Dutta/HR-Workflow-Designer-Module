// Automation API functions

export const automationApi = {
  getAutomationActions: () => {
    // Mock automation actions
    return [
      {
        value: 'send_email',
        label: 'Send Email',
        parameters: [
          { key: 'to', label: 'To', placeholder: 'recipient@example.com' },
          { key: 'subject', label: 'Subject', placeholder: 'Email subject' },
          { key: 'body', label: 'Body', placeholder: 'Email content' },
        ],
      },
      {
        value: 'generate_document',
        label: 'Generate Document',
        parameters: [
          { key: 'template', label: 'Template', placeholder: 'Template name' },
          { key: 'format', label: 'Format', placeholder: 'PDF, DOCX, etc.' },
        ],
      },
      {
        value: 'create_ticket',
        label: 'Create Ticket',
        parameters: [
          { key: 'system', label: 'System', placeholder: 'Jira, ServiceNow, etc.' },
          { key: 'title', label: 'Title', placeholder: 'Ticket title' },
          { key: 'priority', label: 'Priority', placeholder: 'High, Medium, Low' },
        ],
      },
      {
        value: 'update_database',
        label: 'Update Database',
        parameters: [
          { key: 'table', label: 'Table', placeholder: 'Table name' },
          { key: 'field', label: 'Field', placeholder: 'Field to update' },
          { key: 'value', label: 'Value', placeholder: 'New value' },
        ],
      },
      {
        value: 'notify_slack',
        label: 'Notify Slack',
        parameters: [
          { key: 'channel', label: 'Channel', placeholder: '#general' },
          { key: 'message', label: 'Message', placeholder: 'Notification message' },
        ],
      },
    ]
  },
}
