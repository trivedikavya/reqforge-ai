import React, { useState, useEffect, useRef } from 'react'
import { Send, Loader2, Sparkles, Globe, Paperclip, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useWebSocket } from '../../hooks/useWebSocket'
import api from '../../api/axios'

export default function ChatInterface({ projectId, onBRDUpdate }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const { socket } = useWebSocket(projectId)

  useEffect(() => {
    if (socket) {
      socket.on('ai-response', (data) => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          suggestions: data.suggestions
        }])
        setIsLoading(false)

        if (data.brdUpdate) {
          onBRDUpdate(data.brdUpdate)
        }
      })

      socket.on('error', (error) => {
        toast.error(error.message || 'An error occurred')
        setIsLoading(false)
      })

      return () => {
        socket.off('ai-response')
        socket.off('error')
      }
    }
  }, [socket, onBRDUpdate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return
    setFile(selectedFile)
  }

  const handleSend = async () => {
    if ((!message.trim() && !file) || isLoading) return

    let userMessageContent = message.trim()

    // Handle File Upload alongside message
    if (file) {
      setUploading(true)
      const formData = new FormData()
      formData.append('document', file)
      formData.append('projectId', projectId)
      try {
        await api.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        userMessageContent += `\n[Attached File: ${file.name}]`
        toast.success('File uploaded successfully')
      } catch (error) {
        toast.error('File upload failed')
        console.error(error)
        setUploading(false)
        return
      } finally {
        setUploading(false)
        setFile(null)
      }
    }

    setMessage('')
    setIsLoading(true)

    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessageContent
    }])

    if (socket) {
      socket.emit('chat-message', {
        projectId,
        message: userMessageContent,
        timestamp: new Date()
      })
    } else {
      setIsLoading(false)
      toast.error('Not connected to server')
    }
  }

  const handleSuggestionAccept = async (suggestion) => {
    if (socket) {
      socket.emit('accept-suggestion', {
        projectId,
        suggestion
      })
      toast.success('Applying suggestion...', {
        style: { background: '#1a1a1a', color: '#CCFF00', border: '1px solid rgba(204,255,0,0.2)' }
      })
    }
  }

  const handleQuickAction = (action) => {
    const actions = {
      scrape: 'Scrape competitor.com',
      conflicts: 'Check for conflicting requirements',
      metrics: 'Suggest appropriate success metrics'
    }
    setMessage(actions[action])
  }

  return (
    <div className="h-full flex flex-col min-h-0 bg-deepBlack/50 relative">
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-[#181818]/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wider uppercase">AI Architect</h2>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-6 custom-scrollbar text-gray-300">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-neonGreen" />
            </div>
            <p className="text-white font-bold mb-6 tracking-tight text-lg">How should we shape the BRD?</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => handleQuickAction('conflicts')}
                className="px-4 py-2 bg-purple-500/10 text-purple-400 text-xs font-semibold rounded-lg hover:bg-purple-500/20 border border-purple-500/20 transition-all font-mono uppercase"
              >
                Find Conflicts
              </button>
              <button
                onClick={() => handleQuickAction('metrics')}
                className="px-4 py-2 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-all font-mono uppercase"
              >
                Add Metrics
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${msg.role === 'user'
                ? 'bg-white/10 text-white border border-white/20 rounded-tr-sm'
                : 'bg-[#181818] text-gray-300 border border-white/5 rounded-tl-sm'
                }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-neonGreen" />
                  <span className="text-xs font-bold text-neonGreen uppercase tracking-wider">Gemini</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>

              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-4 space-y-3">
                  {msg.suggestions.map((sug, i) => (
                    <div
                      key={i}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-neonGreen/30 transition-colors"
                    >
                      <p className="text-sm text-gray-300 mb-3">{sug.text}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSuggestionAccept(sug)}
                          className="px-4 py-1.5 bg-neonGreen/10 text-neonGreen text-xs font-bold rounded-lg hover:bg-neonGreen/20 border border-neonGreen/20 transition-colors uppercase tracking-wider flex-1"
                        >
                          Accept
                        </button>
                        <button className="px-4 py-1.5 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/20 border border-red-500/20 transition-colors uppercase tracking-wider flex-1">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#181818] border border-white/5 rounded-2xl p-4 rounded-tl-sm">
              <div className="flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-neonGreen" />
                <span className="text-xs text-neonGreen font-mono uppercase tracking-widest animate-pulse">Computing</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-4 bg-[#181818]/90 backdrop-blur-md">

        {/* File Preview */}
        {file && (
          <div className="mb-3 flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-2 pl-3">
            <div className="flex items-center gap-2 truncate text-sm text-gray-300">
              <Paperclip className="w-4 h-4 text-neonGreen shrink-0" />
              <span className="truncate">{file.name}</span>
            </div>
            <button onClick={() => setFile(null)} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => handleQuickAction('scrape')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors font-mono uppercase"
          >
            <Globe className="w-3 h-3" />
            Scrape URL
          </button>
        </div>

        <div className="flex items-end gap-2 relative">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept=".txt,.pdf,.doc,.docx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-neonGreen transition-all shrink-0"
            title="Attach Document"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Instruct the AI or upload context..."
            className="flex-1 px-4 py-3 bg-deepBlack border border-white/10 rounded-xl focus:outline-none focus:border-neonGreen focus:ring-1 focus:ring-neonGreen transition-all text-white min-h-[50px] max-h-[150px] resize-none scrollbar-hide"
            rows="1"
            disabled={isLoading || uploading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || uploading || (!message.trim() && !file)}
            className="p-3 bg-neonGreen text-deepBlack rounded-xl hover:bg-[#b0d900] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(204,255,0,0.2)] shrink-0"
          >
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-[10px] text-gray-500 text-center mt-2 font-mono uppercase tracking-widest">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  )
}