import React, { useState } from 'react'
import { simulateApi } from '../../api/simulateApi'
import { validators } from '../../utils/validators'
import { workflowSerializer } from '../../utils/workflowSerializer'

const SandboxPanel = ({ nodes, edges, isOpen, onClose }) => {
  const [simulationResult, setSimulationResult] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [errors, setErrors] = useState([])

  const handleTestWorkflow = () => {
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

    // Simulate workflow
    setTimeout(() => {
      const result = simulateApi.simulate(workflowData)
      setSimulationResult(result)
      setIsSimulating(false)
    }, 1000)
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
              <p className="text-xs text-green-700">
                Status: {simulationResult.status}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">Execution Steps:</h3>
              {simulationResult.steps.map((step, index) => {
                const node = nodes.find(n => n.data.label === step.nodeName)
                return (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 border border-gray-200 rounded"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-blue-600">
                        Step {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-800">
                          {step.nodeName}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {step.description}
                        </p>
                        
                        {/* Node Metadata */}
                        {node && (
                          <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                            <p className="text-xs font-semibold text-gray-700 mb-1">Metadata:</p>
                            <div className="space-y-0.5">
                              <p className="text-xs text-gray-600">
                                <span className="font-medium">Type:</span> {node.type}
                              </p>
                              {node.data.assignee && (
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">Assignee:</span> {node.data.assignee}
                                </p>
                              )}
                              {node.data.approverRole && (
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">Approver:</span> {node.data.approverRole}
                                </p>
                              )}
                              {node.data.action && (
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">Action:</span> {node.data.action}
                                </p>
                              )}
                              {node.data.description && (
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">Description:</span> {node.data.description}
                                </p>
                              )}
                              {node.data.dueDate && (
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">Due Date:</span> {node.data.dueDate}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {step.output && (
                          <p className="text-xs text-green-700 mt-2">
                            ✓ {step.output}
                          </p>
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
