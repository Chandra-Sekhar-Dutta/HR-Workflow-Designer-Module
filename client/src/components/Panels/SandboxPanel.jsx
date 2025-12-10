import React, { useState } from 'react'
import { simulateApi } from '../../api/simulateApi'
import { validators } from '../../utils/validators'
import { workflowSerializer } from '../../utils/workflowSerializer'

const SandboxPanel = ({ nodes, edges, isOpen, onClose }) => {
  const [simulationResult, setSimulationResult] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [errors, setErrors] = useState([])

  const handleTestWorkflow = async () => {
    setIsSimulating(true)
    setErrors([])
    setSimulationResult(null)

    // Validate workflow
    const validationErrors = validators.validateWorkflow(nodes, edges)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setIsSimulating(false)
      return
    }

    // Serialize workflow
    const workflowData = workflowSerializer.serialize(nodes, edges)

    try {
      // Simulate workflow (now async with mock network delay)
      const result = await simulateApi.simulate(workflowData)
      setSimulationResult(result)
    } catch (error) {
      setErrors([`Simulation error: ${error.message}`])
    } finally {
      setIsSimulating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-300 shadow-lg overflow-y-auto z-50">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Test Workflow</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <button
          onClick={handleTestWorkflow}
          disabled={isSimulating}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 mb-4"
        >
          {isSimulating ? 'Simulating...' : 'Run Simulation'}
        </button>

        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <h3 className="text-sm font-semibold text-red-800 mb-2">
              Validation Errors
            </h3>
            <ul className="space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-xs text-red-700">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {simulationResult && (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <h3 className="text-sm font-semibold text-green-800 mb-2">
                ✅ Simulation Complete
              </h3>
              <div className="space-y-1 text-xs text-green-700">
                <p><span className="font-medium">Status:</span> {simulationResult.status}</p>
                {simulationResult.executionId && (
                  <p><span className="font-medium">Execution ID:</span> {simulationResult.executionId}</p>
                )}
                {simulationResult.totalDuration && (
                  <p><span className="font-medium">Total Duration:</span> {simulationResult.totalDuration}</p>
                )}
                {simulationResult.totalSteps && (
                  <p><span className="font-medium">Total Steps:</span> {simulationResult.totalSteps}</p>
                )}
              </div>
            </div>

            {simulationResult.summary && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                  <div>Start: {simulationResult.summary.startNodes}</div>
                  <div>Tasks: {simulationResult.summary.taskNodes}</div>
                  <div>Approvals: {simulationResult.summary.approvalNodes}</div>
                  <div>Automated: {simulationResult.summary.automatedNodes}</div>
                  <div>End: {simulationResult.summary.endNodes}</div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">Execution Steps:</h3>
              {simulationResult.steps.map((step, index) => {
                const node = nodes.find(n => n.id === step.nodeId)
                const stepNumber = step.stepNumber || (index + 1)
                return (
                  <div
                    key={step.nodeId || index}
                    className="p-3 bg-gray-50 border border-gray-200 rounded hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-emerald-600 rounded-full">
                          {stepNumber}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium text-gray-800">
                            {step.nodeName}
                          </p>
                          {step.duration && (
                            <span className="text-xs text-gray-500 font-mono">
                              {step.duration}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-600 mt-1">
                          {step.description}
                        </p>
                        
                        {/* Enhanced Output */}
                        {step.output && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                            <p className="text-xs text-green-800">
                              <span className="font-medium">✓ Output:</span> {step.output}
                            </p>
                          </div>
                        )}
                        
                        {/* Node Metadata */}
                        {node && (step.metadata || node.data) && (
                          <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                            <p className="text-xs font-semibold text-gray-700 mb-1">Details:</p>
                            <div className="space-y-0.5">
                              <p className="text-xs text-gray-600">
                                <span className="font-medium">Type:</span> {step.nodeType || node.type}
                              </p>
                              {(step.metadata?.assignee || node.data?.assignee) && (
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">Assignee:</span> {step.metadata?.assignee || node.data?.assignee}
                                </p>
                              )}
                              {(step.metadata?.action || node.data?.action) && (
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">Action:</span> {step.metadata?.action || node.data?.action}
                                </p>
                              )}
                              {node.data?.approverRole && (
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">Approver:</span> {node.data.approverRole}
                                </p>
                              )}
                              {node.data?.description && (
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">Description:</span> {node.data.description}
                                </p>
                              )}
                              {step.startTime && (
                                <p className="text-xs text-gray-500 font-mono mt-1">
                                  {new Date(step.startTime).toLocaleTimeString()}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {!simulationResult && !errors.length && (
          <div className="text-center text-gray-400 mt-8">
            <p className="text-sm">Click "Run Simulation" to test your workflow</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SandboxPanel
