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
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = React.useRef(null)
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
    let demoText = "";
    if (templateType === 'agile') {
      demoText = `We are building a new internal tool called "Pulse" for asynchronous team check-ins. The goal is to replace daily standup meetings that take too long and disrupt deep work. 
      
User Personas:
1. "Maker" (Software Engineers, Designers): Needs a fast, distraction-free way to log what they did yesterday, what they are doing today, and any blockers. They prefer Slack integrations over another web portal.
2. "Manager" (Engineering Managers, Product Owners): Needs a high-level summary dashboard to see team progress, identify bottlenecks quickly, and ensure sprints are on track without micromanaging.

Key Epics & Stories:
Epic 1: Slack Integration
- As a Maker, I want to receive an automated DM from Pulse at 9:00 AM local time, so I am prompted to submit my check-in.
- As a Maker, I want to reply directly to the Slack DM with my update, so I don't have to leave my workflow.
- As a Manager, I want to type "/pulse status @team" to instantly see who has and hasn't checked in.

Epic 2: The Action Dashboard
- As a Manager, I want a web dashboard that aggregates all check-ins by team, sortable by "Blocked" status, so I can immediately help unblock my team members.
- As a Maker, I want to view my team's check-ins in a single feed, so I know what others are working on.

Acceptance Criteria: 
The system must support rich text in Slack replies (emojis, lists). The web dashboard must load the feed for a 20-person team in under 1 second. Managers must be able to export weekly summaries to PDF.

Sprint Roadmap:
Sprint 1: Core Slack bot setup, user authentication mapping.
Sprint 2: Daily automated prompts and listening for replies.
Sprint 3: Web dashboard MVP (read-only feed).
Sprint 4: Manager specific views and export functionality.`;

    } else if (templateType === 'standard') {
      demoText = `Project Name: NextGen Retail Inventory Optimization System (N-RIOS)

Executive Summary:
Our mid-sized retail chain, "Urban Elements," currently operates 45 physical locations and a growing e-commerce storefront. We are struggling with frequent stockouts on popular items and overstocking of low-velocity goods. We need a centralized Inventory Optimization System (N-RIOS) to intelligently forecast demand, automate reorder workflows, and provide real-time visibility across all warehouses and stores.

Project Objectives (S.M.A.R.T):
- Specific: Implement a cloud-based inventory management system integrated with our existing Shopify e-commerce and point-of-sale (POS) systems.
- Measurable: Reduce stockouts of top-100 SKUs by 40% and decrease overall excess inventory holding costs by 15% within the first 6 months.
- Attainable: Utilize commercial-off-the-shelf (COTS) software solutions rather than building from scratch.
- Relevant: Aligns directly with the Q3 strategic priority to improve gross margins and customer satisfaction.
- Time-bound: Full deployment and staff training completed within 4 months (120 days) from project kick-off.

Needs Statement:
Without N-RIOS, our purchasing team relies on fragmented Excel spreadsheets, leading to human error and delayed reordering. This results in lost revenue from unfulfilled online orders and ties up capital in dead stock.

Project Scope:
The scope includes integrating the new software with Shopify (online) and our physical cash registers. We will deliver advanced reporting dashboards for executives and automated purchase order generation for buyers. Scope explicitly excludes changes to our physical logistics and shipping providers.

Current vs Proposed Process:
As-Is: Store managers email weekly inventory reports to HQ. Buyers manually consolidate these into a master spreadsheet and guess order quantities.
To-Be: POS terminals automatically deduct inventory upon sale. The system detects when an item crosses the minimum threshold and auto-drafts a purchase order for the buyer's approval.

Project Requirements:
1. Real-time syncing with POS within 5 minutes of a transaction.
2. Demand forecasting module utilizing historical sales data and seasonal trends.
3. Multi-warehouse support, tracking inventory in transit between locations.
4. Role-based access control (Store Manager vs HQ Buyer vs Executive).

Stakeholders:
- Sarah Jenkins (VP of Operations) - Project Sponsor
- Marcus Chen (Lead Buyer) - Core User
- IT Deployment Team - Implementation

Project Schedule:
Month 1: Vendor Selection and Database Schema Mapping.
Month 2: API Integration with Shopify and POS.
Month 3: Pilot testing in 3 physical locations.
Month 4: Full rollout and user training.

Cost-Benefit Analysis:
Estimated initial software and integration cost: $85,000. Expected annual savings from reduced holding costs and recovered lost sales: $240,000. ROI expected within 5 months post-launch.`;

    } else {
      demoText = `We are initiating Project Phoenix, a strategic overhaul of our core banking monolith at "FinTech Global" aiming to migrate to a highly scalable, cloud-native microservices architecture on AWS. Our lead investor, Orion Capital Partners, recently infused $15 million following a 3-for-1 stock split, accelerating our timeline. We must have the new ledger systems operational by the end of Q4 (December 31st).

The current monolithic application handles 2 million daily transactions but suffers from unacceptable latency during peak trading hours. By breaking the system into discrete microservices (User Profiles, Real-Time Ledger, and Payment Gateway) using containerized deployments, we anticipate reducing average response times by 40% while ensuring 99.99% uptime. 

Our main constraints are a hard budget of $5.2M, and the fact that we cannot experience any downtime during the transition, necessitating a Strangler Fig deployment pattern. The Enterprise Architecture Review Board requires strict adherence to PCI-DSS compliance and Zero-Trust mutual TLS across the service mesh. Key stakeholders driving this include our CISO, Sarah Jenkins, who oversees the security audits, and VP of Engineering, David Chen, who is managing the AWS infrastructure rollout. This system is critical for our Q1 roadmap, and any delays will breach our SLAs with our institutional clients.`;
    }

    setInitialData(demoText);
  }

  const handleLetsGo = async () => {
    if (!initialData.trim() && !selectedFile) {
      toast.error('Please describe your project or upload context first')
      return
    }

    setLoading(true)

    try {
      // 1. Create a quick project entry
      const rawName = initialData ? initialData.split(' ').slice(0, 4).join(' ') : (selectedFile ? selectedFile.name : 'New Project');
      const projectName = rawName + '...';
      const projectResponse = await api.post('/api/projects', {
        name: projectName,
        description: 'Generated from initial context',
        templateType
      })

      const projectId = projectResponse.data.project._id

      // 1.5. Upload file if selected
      if (selectedFile) {
        const formData = new FormData()
        formData.append('files', selectedFile)
        formData.append('projectId', projectId)
        try {
          await api.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          toast.success('Context uploaded successfully')
        } catch (uploadError) {
          toast.error('Failed to upload document context, continuing...')
          console.error(uploadError)
        }
      }

      // 2. Trigger Gemini to generate the initial BRD
      await api.post(`/api/brd/${projectId}/generate`, {
        projectId,
        templateType,
        initialData: initialData || '[Context sourced from uploaded document]'
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
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  accept=".txt,.pdf,.doc,.docx"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center gap-2 px-4 py-2 ${selectedFile ? 'bg-neonGreen/10 border-neonGreen/20 text-neonGreen' : 'bg-white/5 border-white/10 text-gray-300'} rounded-lg hover:bg-white/10 hover:text-white transition-all text-sm font-medium`}
                >
                  <Upload className="w-4 h-4" /> {selectedFile ? selectedFile.name : 'Upload Context'}
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