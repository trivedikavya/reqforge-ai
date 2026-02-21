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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-[#111111] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all custom-scrollbar relative">
        <div className="absolute inset-0 bg-gradient-to-br from-neonGreen/5 to-transparent pointer-events-none z-0 rounded-2xl" />

        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#0a0a0a]/50 rounded-t-2xl relative z-10">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight flex items-center gap-3">
            <span className="text-neonGreen font-mono text-sm tracking-widest uppercase bg-neonGreen/10 px-3 py-1 rounded-md border border-neonGreen/20">
              Step {step}
            </span>
            {step === 1 ? 'Select Architecture' : 'Initial Directives'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 text-gray-400 hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 relative z-10 text-gray-300">
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
                    className={`cursor-pointer rounded-xl p-6 border transition-all duration-300 hover:shadow-2xl group
                      ${templateType === template.id
                        ? 'border-neonGreen bg-neonGreen/5 shadow-[0_0_20px_rgba(204,255,0,0.1)] transform scale-[1.02]'
                        : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}
                  >
                    <div className={`mb-4 transition-transform group-hover:scale-110 ${templateType === template.id ? 'text-neonGreen' : 'text-gray-400 group-hover:text-white'}`}>
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 tracking-wide ${templateType === template.id ? 'text-white' : 'text-gray-300'}`}>{template.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">

              <div className="flex flex-wrap gap-4 items-center mb-6">
                {/* Functional Buttons */}
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 hover:text-white transition-all text-sm font-medium">
                  <Upload className="w-4 h-4" /> Upload Context
                </button>
                <button
                  onClick={handleDemoData}
                  className="flex items-center gap-2 px-4 py-2 bg-neonGreen/10 border border-neonGreen/20 text-neonGreen rounded-lg hover:bg-neonGreen/20 transition-all text-sm font-medium uppercase tracking-wider"
                >
                  <Sparkles className="w-4 h-4" /> Load Demo Data
                </button>

                <div className="h-8 w-px bg-white/10 mx-2"></div>

                {/* Pending Buttons */}
                <ComingSoonTooltip>
                  <button disabled className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-white/5 text-gray-600 rounded-lg cursor-not-allowed text-sm font-medium">
                    <Mail className="w-4 h-4" /> Gmail Sync
                  </button>
                </ComingSoonTooltip>

                <ComingSoonTooltip>
                  <button disabled className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-white/5 text-gray-600 rounded-lg cursor-not-allowed text-sm font-medium">
                    <Hash className="w-4 h-4" /> Comm Sync
                  </button>
                </ComingSoonTooltip>
              </div>

              <div>
                <textarea
                  value={initialData}
                  onChange={(e) => setInitialData(e.target.value)}
                  placeholder="Describe your project requirements, target audience, objectives..."
                  rows={10}
                  className="w-full px-5 py-5 bg-[#0a0a0a] text-white border border-white/10 rounded-xl focus:ring-1 focus:ring-neonGreen focus:border-neonGreen transition-all resize-none placeholder:text-gray-600 custom-scrollbar"
                />
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-white/10">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2.5 text-gray-500 font-medium hover:text-white transition-colors"
                >
                  ← Rethink Architecture
                </button>
                <button
                  onClick={handleLetsGo}
                  disabled={loading}
                  className="px-8 py-3 bg-neonGreen text-deepBlack font-bold rounded-xl hover:bg-[#b0d900] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] flex items-center gap-2 uppercase tracking-wider"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-deepBlack/30 border-t-deepBlack rounded-full animate-spin" />
                      Initializing Forge...
                    </>
                  ) : (
                    <>
                      Execute Sequence <Sparkles className="w-5 h-5" />
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