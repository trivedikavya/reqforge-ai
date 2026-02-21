import React, { useState } from 'react'
import { X, Upload, Mail, Hash, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/axios'

// Helper component for tooltips
const ComingSoonTooltip = ({ children }) => (
  <div className="relative group inline-block">
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white z-10"></div>
    {children}
    <div className="absolute bottom-full left-1/2 min-w-[max-content] p-2 bg-gray-900 text-white text-xs rounded shadow-lg transform -translate-x-1/2 mb-2 hidden group-hover:block transition-opacity duration-300 pointer-events-none z-20">
      Coming Soon
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

export default function CreateProjectModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1)
  const [templateType, setTemplateType] = useState('comprehensive')
  const [initialData, setInitialData] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const templates = [
    {
      id: 'comprehensive',
      name: 'Comprehensive BRD',
      description: 'Full-scale documentation for enterprise projects including all standard sections.'
    },
    {
      id: 'standard',
      name: 'Standard BRD',
      description: 'Balanced documentation suitable for most medium-sized projects.'
    },
    {
      id: 'agile',
      name: 'Agile Quick-Start',
      description: 'Lean documentation focused on user stories and core requirements.'
    }
  ]

  const handleDemoData = () => {
    setInitialData("We are building an e-commerce platform for selling organic dog food. It needs a user-facing storefront with a product catalog, shopping cart, and checkout process using Stripe. Users should be able to create accounts, track orders, and save payment methods. The admin dashboard must allow managers to add/edit products, track inventory, and view sales reports. We also need a subscription model where users get dog food delivered monthly.");
  }

  const handleLetsGo = async () => {
    if (!initialData.trim()) {
      toast.error('Please describe your project first')
      return
    }

    setLoading(true)

    try {
      // 1. Create a quick project entry
      const projectName = initialData.split(' ').slice(0, 4).join(' ') + '...';
      const projectResponse = await api.post('/api/projects', {
        name: projectName,
        description: 'Generated from initial context',
        templateType
      })

      const projectId = projectResponse.data.project._id

      // 2. Trigger Gemini to generate the initial BRD
      await api.post(`/api/brd/${projectId}/generate`, {
        projectId,
        templateType,
        initialData
      })

      toast.success('Project and BRD generated successfully!')
      onSuccess?.()
      onClose()

      // Navigate to Step 3: Workspace
      navigate(`/project/${projectId}`)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate BRD')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {step === 1 ? 'Step 1: Select BRD Template' : 'Step 2: Initial Rough Data'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => {
                      setTemplateType(template.id);
                      setStep(2);
                    }}
                    className={`cursor-pointer rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-xl group
                      ${templateType === template.id
                        ? 'border-blue-500 bg-blue-50/50 shadow-md transform scale-[1.02]'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                  >
                    <div className="mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">

              <div className="flex flex-wrap gap-4 items-center mb-6">
                {/* Functional Buttons */}
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all text-sm font-medium">
                  <Upload className="w-4 h-4" /> Upload Data
                </button>
                <button
                  onClick={handleDemoData}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 hover:shadow-sm transition-all text-sm font-medium"
                >
                  ✨ Go with Demo
                </button>

                <div className="h-8 w-px bg-gray-200 mx-2"></div>

                {/* Pending Buttons */}
                <ComingSoonTooltip>
                  <button disabled className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium">
                    <Mail className="w-4 h-4" /> Gmail Sync
                  </button>
                </ComingSoonTooltip>

                <ComingSoonTooltip>
                  <button disabled className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium">
                    <Hash className="w-4 h-4" /> Slack/Discord
                  </button>
                </ComingSoonTooltip>
              </div>

              <div>
                <textarea
                  value={initialData}
                  onChange={(e) => setInitialData(e.target.value)}
                  placeholder="Describe your project requirements, features, goals, or paste your rough notes here..."
                  rows={10}
                  className="w-full px-4 py-4 text-gray-700 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none shadow-inner"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2.5 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                >
                  ← Back to Templates
                </button>
                <button
                  onClick={handleLetsGo}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      Let's Go <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}