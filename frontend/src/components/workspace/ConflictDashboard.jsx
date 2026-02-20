import React from 'react'
import { AlertTriangle } from 'lucide-react'

export default function ConflictDashboard({ conflicts, onResolve }) {
  if (!conflicts || conflicts.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-3xl">✓</span>
        </div>
        <p className="text-gray-600">No conflicts detected</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
        {conflicts.length} Conflict{conflicts.length > 1 ? 's' : ''} Detected
      </h3>

      {conflicts.map((conflict, index) => (
        <div
          key={conflict.id || index}
          className="border border-yellow-200 rounded-lg p-4 bg-yellow-50"
        >
          <h4 className="font-medium text-gray-900 mb-2">
            Conflict #{index + 1}: {conflict.type}
          </h4>
          <p className="text-sm text-gray-700 mb-3">{conflict.description}</p>

          {conflict.resolutionOptions && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-800">
                Resolution Options:
              </p>
              {conflict.resolutionOptions.map((option, i) => (
                <button
                  key={i}
                  onClick={() => onResolve(conflict.id, option)}
                  className="w-full text-left p-2 border border-gray-300 rounded bg-white hover:bg-gray-50 text-sm transition-colors"
                >
                  {i + 1}. {option.description}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}