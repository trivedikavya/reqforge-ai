import React, { useState } from 'react'
import { X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import TemplateSelector from '../workspace/TemplateSelector'

export default function CreateProjectModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [templateType, setTemplateType] = useState('comprehensive')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files))
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please enter a project name')
      return
    }

    setLoading(true)

    try {
      // Create project
      const projectResponse = await api.post('/api/projects', {
        name,
        description,
        templateType
      })

      const projectId = projectResponse.data.project._id

      // Upload files if any
      if (files.length > 0) {
        const formData = new FormData()
        files.forEach(file => {
          formData.append('files', file)
        })
        formData.append('projectId', projectId)

        await api.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      toast.success('Project created successfully!')
      onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Mobile App BRD"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your project..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next: Select Template
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Select BRD Template
                </label>
                <TemplateSelector
                  selectedTemplate={templateType}
                  onSelect={setTemplateType}
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next: Upload Files
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Upload Documents (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.txt,.json"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-blue-600 hover:underline"
                  >
                    Choose files
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    PDF, DOCX, TXT, JSON (Max 10MB each)
                  </p>
                  {files.length > 0 && (
                    <div className="mt-4 text-left">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Selected files:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {files.map((file, i) => (
                          <li key={i}>• {file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}