import React, { useState } from 'react'
import { Calendar, FileText, MoreVertical, Edit2, Trash2 } from 'lucide-react'

export default function ProjectCard({ project, onClick, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false)

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const statusColors = {
    draft: 'bg-white/10 text-gray-300 border border-white/20',
    in_review: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    approved: 'bg-neonGreen/10 text-neonGreen border border-neonGreen/20',
    archived: 'bg-red-500/10 text-red-400 border border-red-500/20'
  }

  const handleMenuClick = (e) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    setShowMenu(false)
    onEdit(project)
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setShowMenu(false)
    onDelete(project._id)
  }

  return (
    <div
      onClick={onClick}
      className="bg-deepBlack/40 backdrop-blur-sm rounded-xl border border-white/10 hover:border-neonGreen/40 transition-all cursor-pointer p-6 group relative shadow-lg"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center group-hover:border-neonGreen/50 group-hover:shadow-[0_0_15px_rgba(204,255,0,0.2)] transition-all">
            <FileText className="w-5 h-5 text-neonGreen" />
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-neonGreen transition-colors">{project.name}</h3>
            <p className="text-sm text-gray-400 capitalize">{project.templateType}</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={handleMenuClick}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-10 py-1">
              <button
                onClick={handleEditClick}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-neonGreen flex items-center gap-2 transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-6 line-clamp-2 h-10">
        {project.description || 'No description provided.'}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          {formatDate(project.createdAt)}
        </div>
        <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${statusColors[project.status] || statusColors.draft}`}>
          {project.status || 'draft'}
        </span>
      </div>
    </div>
  )
}