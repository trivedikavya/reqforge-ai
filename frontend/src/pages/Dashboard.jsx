import React, { useState, useEffect } from 'react'
import { Plus, FolderOpen, LogOut, Check, X, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'
import ProjectCard from '../components/dashboard/ProjectCard'
import CreateProjectModal from '../components/dashboard/CreateProjectModal'
import Header from '../components/common/Header'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editProject, setEditProject] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects')
      setProjects(response.data.projects || [])
    } catch (error) {
      toast.error('Failed to load projects')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`)
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const handleDelete = async (projectId) => {
    try {
      await api.delete(`/api/projects/${projectId}`)
      toast.success('Project deleted successfully')
      setDeleteConfirm(null)
      fetchProjects()
    } catch (error) {
      toast.error('Failed to delete project')
      console.error(error)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/api/projects/${editProject._id}`, editForm)
      toast.success('Project updated successfully')
      setEditProject(null)
      fetchProjects()
    } catch (error) {
      toast.error('Failed to update project')
      console.error(error)
    }
  }

  const openEditModal = (project) => {
    setEditProject(project)
    setEditForm({ name: project.name, description: project.description || '' })
  }

  return (
    <div className="min-h-screen bg-deepBlack text-white">
      <Header onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-neonGreen/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Your Workspaces</h1>
            <p className="text-gray-400 mt-2">Manage your BRD generation projects</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-neonGreen text-deepBlack font-bold rounded-lg hover:bg-[#b0d900] transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)]"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neonGreen"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-32 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm relative z-10">
            <FolderOpen className="w-20 h-20 mx-auto text-gray-500 mb-6" />
            <p className="text-gray-400 text-xl mb-6">No workspaces forged yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-neonGreen hover:text-white transition-colors border-b border-neonGreen/30 hover:border-white pb-1"
            >
              Forge your first project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onClick={() => handleProjectClick(project._id)}
                onEdit={openEditModal}
                onDelete={setDeleteConfirm}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deepBlack/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 w-full max-w-sm p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 mx-auto border border-red-500/20">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-center text-white mb-2">Delete Project?</h3>
            <p className="text-gray-400 text-center text-sm mb-6">
              This action cannot be undone. This will permanently delete the project and all associated BRD data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deepBlack/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Edit Workspace</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-deepBlack border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neonGreen focus:ring-1 focus:ring-neonGreen transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full bg-deepBlack border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neonGreen focus:ring-1 focus:ring-neonGreen transition-all resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setEditProject(null)}
                  className="flex-1 px-4 py-2.5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-neonGreen text-deepBlack font-bold rounded-lg hover:bg-[#b0d900] shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            fetchProjects()
          }}
        />
      )}
    </div>
  )
}