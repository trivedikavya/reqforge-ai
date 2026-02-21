import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/api/auth/register', { name, email, password })
      toast.success('Registration successful! Please login.', {
        style: { background: '#1a1a1a', color: '#CCFF00', border: '1px solid rgba(204,255,0,0.2)' }
      })
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-deepBlack relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neonGreen/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="bg-[#111111]/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(204,255,0,0.15)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-neonGreen/10 group-hover:bg-neonGreen/20 transition-colors" />
              <span className="text-3xl font-black text-white relative z-10 font-mono tracking-tighter">R</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-widest uppercase">Create Access</h1>
          <p className="text-gray-400 mt-3 font-mono text-sm tracking-wider uppercase">Join ReqForge AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono tracking-widest text-gray-400 uppercase mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#0a0a0a] text-white border border-white/10 rounded-xl focus:ring-1 focus:ring-neonGreen focus:border-neonGreen focus:outline-none transition-all placeholder:text-gray-600"
              placeholder="System Administrator"
            />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest text-gray-400 uppercase mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#0a0a0a] text-white border border-white/10 rounded-xl focus:ring-1 focus:ring-neonGreen focus:border-neonGreen focus:outline-none transition-all placeholder:text-gray-600"
              placeholder="operator@system.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest text-gray-400 uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-[#0a0a0a] text-white border border-white/10 rounded-xl focus:ring-1 focus:ring-neonGreen focus:border-neonGreen focus:outline-none transition-all placeholder:text-gray-600"
              placeholder="••••••••••••"
            />
            <p className="text-[10px] uppercase font-mono tracking-widest text-neonGreen/60 mt-2">Minimum 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neonGreen text-deepBlack font-bold py-3.5 rounded-xl hover:bg-[#b0d900] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] uppercase tracking-wider text-sm flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Identity...' : <><UserPlus className="w-4 h-4" /> Create Account</>}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already registered?{' '}
          <Link to="/login" className="text-neonGreen hover:text-white transition-colors border-b border-neonGreen/30 hover:border-white pb-0.5">
            Authenticate here
          </Link>
        </p>
      </div>
    </div>
  )
}