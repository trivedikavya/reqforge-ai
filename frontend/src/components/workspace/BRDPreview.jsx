import React from 'react'
import { Download, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
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
      <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-gray-900">BRD Preview</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={() => handleExport('docx')}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
          >
            <FileText className="w-4 h-4" />
            DOCX
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-white">
        {brd && brd.content ? (
          <div className="prose prose-blue max-w-none text-gray-800">
            <ReactMarkdown>
              {typeof brd.content === 'string' ? brd.content : JSON.stringify(brd.content, null, 2)}
            </ReactMarkdown>

            {brd.conflicts && brd.conflicts.length > 0 && (
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <span>⚠️</span> Conflicts Detected
                </h3>
                <ul className="list-disc list-inside text-yellow-700 space-y-1">
                  {brd.conflicts.map((conflict, i) => (
                    <li key={i}>{conflict.description}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileText className="w-16 h-16 text-gray-300 mb-4 animate-pulse" />
            <p className="text-gray-500 text-lg mb-2 font-medium">No BRD generated yet</p>
            <p className="text-gray-400 text-sm">
              Use the chat interface to generate your BRD or wait for completion.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}