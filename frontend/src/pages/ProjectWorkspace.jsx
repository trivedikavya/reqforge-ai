import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useWebSocket } from '../hooks/useWebSocket'
import BRDPreview from '../components/workspace/BRDPreview'
import ChatInterface from '../components/workspace/ChatInterface'
import Header from '../components/common/Header'

export default function ProjectWorkspace() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [brd, setBrd] = useState(null)
  const [loading, setLoading] = useState(true)
  const { socket } = useWebSocket(id)

  useEffect(() => {
    fetchProject()
    fetchBRD()
  }, [id])

  useEffect(() => {
    if (socket) {
      socket.on('brd-updated', (data) => {
        setBrd(data.brd)
        toast.success('BRD instantly updated via AI', {
          icon: '✨',
          style: {
            background: '#1a1a1a',
            color: '#CCFF00',
            border: '1px solid rgba(204,255,0,0.2)'
          }
        })
      })

      return () => {
        socket.off('brd-updated')
      }
    }
  }, [socket])

  const fetchProject = async () => {
    try {
      const response = await api.get(`/api/projects/${id}`)
      setProject(response.data.project)
    } catch (error) {
      toast.error('Failed to load project')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBRD = async () => {
    try {
      const response = await api.get(`/api/brd/${id}`)
      setBrd(response.data.brd)
    } catch (error) {
      console.error('BRD not generated yet:', error)
    }
  }

  const handleBRDUpdate = (updatedBrd) => {
    setBrd(updatedBrd)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlack flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neonGreen"></div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-deepBlack flex flex-col text-white overflow-hidden">
      <Header />

      <div className="flex-1 flex flex-col min-h-0">
        {/* Workspace Toolbar */}
        <div className="bg-[#111111] border-b border-white/10 px-4 py-3 shrink-0 relative z-10">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  {project?.name || 'Workspace'}
                  <span className="text-neonGreen"><Sparkles className="w-4 h-4" /></span>
                </h1>
                <p className="text-xs text-gray-500 font-mono tracking-wider uppercase mt-0.5">
                  {project?.templateType || 'Standard'} Mode
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-neonGreen animate-pulse"></span>
                <span className="text-xs text-neonGreen font-mono uppercase tracking-wider">Live Sync</span>
              </div>
              <div className="h-4 w-px bg-white/10 mx-2"></div>
              <span className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 text-xs font-medium rounded-full uppercase tracking-wider">
                {project?.status || 'draft'}
              </span>
            </div>
          </div>
        </div>

        {/* Split View Container */}
        <div className="flex-1 grid grid-cols-2 gap-4 p-4 max-w-[1600px] w-full mx-auto min-h-0">

          {/* Left Panel: BRD Preview */}
          <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative flex flex-col min-h-0">
            <div className="absolute inset-0 bg-gradient-to-br from-neonGreen/5 to-transparent pointer-events-none z-0" />
            <div className="relative z-10 flex-1 flex flex-col min-h-0">
              <BRDPreview brd={brd} projectId={id} />
            </div>
          </div>

          {/* Right Panel: Chat Interface */}
          <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative flex flex-col min-h-0">
            <div className="relative z-10 flex-1 flex flex-col min-h-0">
              <ChatInterface projectId={id} onBRDUpdate={handleBRDUpdate} />
            </div>
          </div>

        </div>
      </div>

      {/* Custom Scrollbar Styles for the Split View */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(204, 255, 0, 0.3);
        }
      `}} />
    </div>
  )
}