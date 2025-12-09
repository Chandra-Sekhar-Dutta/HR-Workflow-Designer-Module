import React, { useMemo } from 'react'
import { validators } from '../../utils/validators'

const ValidationPanel = ({ nodes, edges, isOpen, onClose }) => {
  const validation = useMemo(() => {
    if (!isOpen || nodes.length === 0) return { errors: [], warnings: [] }
    return validators.validateWorkflow(nodes, edges)
  }, [nodes, edges, isOpen])

  if (!isOpen) return null

  const hasIssues = validation.errors.length > 0 || validation.warnings.length > 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-[500px] max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Workflow Validation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-140px)]">
          {!hasIssues ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Workflow is Valid!</h3>
              <p className="text-sm text-gray-600 text-center">
                Your workflow has no validation errors and is ready to be saved.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {validation.errors.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Errors ({validation.errors.length})
                  </h3>
                  <ul className="space-y-2">
                    {validation.errors.map((error, idx) => (
                      <li key={idx} className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.warnings.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-yellow-700 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    Warnings ({validation.warnings.length})
                  </h3>
                  <ul className="space-y-2">
                    {validation.warnings.map((warning, idx) => (
                      <li key={idx} className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          {!hasIssues && (
            <button
              onClick={() => {
                // Save workflow logic
                console.log('Save workflow')
                onClose()
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Workflow
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ValidationPanel
