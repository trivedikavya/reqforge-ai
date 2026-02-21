import React from 'react'
import { LogOut, User } from 'lucide-react'

export default function Header({ onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <header className="bg-[#0a0a0a] border-b border-white/10 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-neonGreen shadow-[0_0_10px_rgba(204,255,0,0.2)] bg-deepBlack/50">
              <span className="text-neonGreen font-bold font-mono">R</span>
            </div>
            <span className="text-xl font-bold text-white tracking-widest flex items-center gap-2">
              REQFORGE <span className="text-neonGreen">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
              <User className="w-4 h-4 text-neonGreen/80" />
              <span>{user.name || 'User'}</span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-gray-300 hover:text-white border border-transparent hover:border-white/10 hover:bg-white/5 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}