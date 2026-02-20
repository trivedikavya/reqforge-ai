import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
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
        toast.success('BRD updated!')
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {project?.name || 'Project'}
                </h1>
                <p className="text-sm text-gray-500">
                  {project?.templateType || 'Template'} Template
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {project?.status || 'draft'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 p-4 max-w-7xl mx-auto w-full">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <BRDPreview brd={brd} projectId={id} />
          </div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ChatInterface projectId={id} onBRDUpdate={handleBRDUpdate} />
          </div>
        </div>
      </div>
    </div>
  )
}