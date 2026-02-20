import React from 'react'
import { Download, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'

export default function BRDPreview({ brd, projectId }) {
  const handleExport = async (format) => {
    try {
      toast.loading('Generating export...')
      
      const response = await api.post(
        `/api/brd/${projectId}/export`,
        { format },
        { responseType: 'blob' }
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `BRD_${projectId}.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast.dismiss()
      toast.success('Export completed!')
    } catch (error) {
      toast.dismiss()
      toast.error('Export failed')
      console.error(error)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">BRD Preview</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={() => handleExport('docx')}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
          >
            <FileText className="w-4 h-4" />
            DOCX
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {brd ? (
          <div className="prose max-w-none">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Business Requirements Document
            </h1>

            {brd.content && Object.entries(brd.content).map(([key, section]) => (
              <div key={key} className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3 capitalize">
                  {key.replace(/_/g, ' ')}
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {typeof section === 'object' ? section.text || JSON.stringify(section, null, 2) : section}
                </div>
              </div>
            ))}

            {brd.conflicts && brd.conflicts.length > 0 && (
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  ⚠️ Conflicts Detected
                </h3>
                <ul className="list-disc list-inside text-yellow-700">
                  {brd.conflicts.map((conflict, i) => (
                    <li key={i}>{conflict.description}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">No BRD generated yet</p>
            <p className="text-gray-400 text-sm">
              Use the chat interface to generate your BRD
            </p>
          </div>
        )}
      </div>
    </div>
  )
}