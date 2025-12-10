# HR Workflow Designer - Mock API Layer

This directory contains a lightweight mock API layer that simulates backend services for the HR Workflow Designer application.

## Overview

The API layer uses client-side mocks to provide realistic data and behavior without requiring an actual backend server. This is ideal for development, testing, and demonstrations.

## API Endpoints

### 1. GET /automations

**Purpose:** Retrieve a list of available automated actions that can be used in workflows.

**Implementation:** `automationApi.getAutomations()`

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": "send_email",
      "label": "Send Email",
      "params": ["to", "subject", "body"]
    },
    {
      "id": "generate_doc",
      "label": "Generate Document",
      "params": ["template", "recipient", "format"]
    }
  ]
}
```

**Available Automations:**
- `send_email` - Send Email
- `generate_doc` - Generate Document
- `create_ticket` - Create Support Ticket
- `update_database` - Update Database Record
- `notify_slack` - Send Slack Notification
- `schedule_meeting` - Schedule Meeting
- `assign_task` - Assign Task
- `generate_report` - Generate Report

**Usage Example:**
```javascript
import { automationApi } from './api/automationApi'

const automations = await automationApi.getAutomations()
console.log(automations.data)
```

---

### 2. POST /simulate

**Purpose:** Simulate the execution of a workflow and return step-by-step results.

**Implementation:** `simulateApi.simulate(workflowData)`

**Request Format:**
```json
{
  "name": "Employee Onboarding",
  "nodes": [
    {
      "id": "start-1",
      "type": "start",
      "data": { "label": "Start", "assignee": "HR Admin" }
    },
    {
      "id": "task-1",
      "type": "task",
      "data": { "label": "Complete Forms", "assignee": "New Employee" }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "start-1",
      "target": "task-1"
    }
  ]
}
```

**Response Format:**
```json
{
  "success": true,
  "executionId": "exec_1702234567890_abc123",
  "workflowName": "Employee Onboarding",
  "executedAt": "2025-12-10T12:34:56.789Z",
  "totalDuration": "3500ms",
  "totalSteps": 5,
  "status": "completed",
  "steps": [
    {
      "stepNumber": 1,
      "nodeId": "start-1",
      "nodeType": "start",
      "nodeName": "Start",
      "description": "Workflow initiated by HR Admin",
      "output": "Workflow started successfully. All prerequisites validated.",
      "status": "success",
      "duration": "100ms",
      "startTime": "2025-12-10T12:34:56.789Z",
      "endTime": "2025-12-10T12:34:56.889Z",
      "metadata": {
        "assignee": "HR Admin",
        "action": null,
        "parameters": null
      }
    }
  ],
  "summary": {
    "startNodes": 1,
    "taskNodes": 2,
    "approvalNodes": 1,
    "automatedNodes": 1,
    "endNodes": 1
  }
}
```

**Usage Example:**
```javascript
import { simulateApi } from './api/simulateApi'

const workflowData = {
  name: "Test Workflow",
  nodes: [...],
  edges: [...]
}

const result = await simulateApi.simulate(workflowData)
console.log(result.steps)
```

---

## Features

### 🎯 Realistic Behavior
- Simulated network delays (300-500ms)
- Random execution durations for each step
- Unique execution IDs for tracking
- Timestamp generation for each step

### 🔄 Topological Execution
- Automatically determines execution order based on workflow graph
- Follows edges from start nodes to end nodes
- Handles disconnected nodes gracefully

### 📊 Detailed Outputs
- Step-by-step execution details
- Duration tracking per step
- Metadata for each node execution
- Summary statistics

### ✅ Error Handling
- Validates workflow data before simulation
- Returns appropriate error messages
- Handles missing or invalid nodes

### 🔙 Backward Compatibility
- Legacy `getAutomationActions()` method maintains compatibility with existing components
- Transforms new API format to old format automatically

---

## Implementation Details

### Mock Data Structure

**Automation Actions:**
Each automation action includes:
- `id`: Unique identifier
- `label`: Human-readable name
- `params`: Array of required parameter names

**Simulation Results:**
Each execution step includes:
- Step number and node information
- Description and output text
- Status and timing information
- Metadata for additional context

### Execution Flow

1. **Validation**: Checks for valid workflow data
2. **Order Building**: Uses topological sort to determine execution sequence
3. **Step Execution**: Simulates each step with appropriate delays
4. **Result Compilation**: Aggregates all steps into comprehensive result

---

## Integration with Components

### Automated Node Form
The `AutomatedNodeForm` component uses `getAutomationActions()` to populate the action dropdown:

```javascript
useEffect(() => {
  automationApi.getAutomationActions().then(actions => {
    setAvailableActions(actions)
  })
}, [])
```

### Sandbox Panel
The `SandboxPanel` component uses `simulate()` to test workflow execution:

```javascript
const handleSimulate = async () => {
  const result = await simulateApi.simulate({
    name: "Test Workflow",
    nodes: nodes,
    edges: edges
  })
  setSimulationResults(result)
}
```

---

## Future Enhancements

### Potential Improvements:
1. **Conditional Logic**: Support for branching based on approval outcomes
2. **Error Scenarios**: Simulate failure cases and retry logic
3. **Parallel Execution**: Handle multiple parallel paths in workflows
4. **Webhook Support**: Mock webhook triggers and responses
5. **Data Persistence**: Store simulation history in localStorage
6. **Export Results**: Download simulation results as JSON/CSV
7. **Real-time Updates**: WebSocket simulation for live progress updates

### Migration to Real Backend:
When ready to migrate to a real backend:
1. Replace mock implementations with actual API calls
2. Update base URL configuration
3. Add authentication headers
4. Implement error handling for network failures
5. Add retry logic and request cancellation

---

## Testing

### Manual Testing:
1. Open the Workflow Builder
2. Create a workflow with multiple node types
3. Click "Live Preview" to open the Sandbox Panel
4. Click "Simulate" to see step-by-step execution

### Automated Testing:
```javascript
// Example test
import { simulateApi } from './api/simulateApi'

test('should simulate workflow execution', async () => {
  const workflow = {
    nodes: [
      { id: '1', type: 'start', data: { label: 'Start' } }
    ],
    edges: []
  }
  
  const result = await simulateApi.simulate(workflow)
  
  expect(result.success).toBe(true)
  expect(result.steps.length).toBe(1)
  expect(result.steps[0].nodeType).toBe('start')
})
```

---

## API Contract

This mock API follows RESTful conventions and can be easily replaced with a real backend implementation that follows the same contract.

**Base URL** (for future real implementation): `/api/v1`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <token>` (when authentication is added)

**Error Response Format:**
```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE"
}
```

---

## License

Part of the HR Workflow Designer Module project.
