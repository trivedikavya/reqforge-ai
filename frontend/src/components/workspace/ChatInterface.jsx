import React, { useState, useEffect, useRef } from 'react'
import { Send, Loader2, Sparkles, Globe } from 'lucide-react'
import toast from 'react-hot-toast'
import { useWebSocket } from '../../hooks/useWebSocket'
import api from '../../api/axios'

export default function ChatInterface({ projectId, onBRDUpdate }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
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

  const handleSend = async () => {
    if (!message.trim() || isLoading) return

    const userMessage = message.trim()
    setMessage('')
    setIsLoading(true)

    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage
    }])

    if (socket) {
      socket.emit('chat-message', {
        projectId,
        message: userMessage,
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
      toast.success('Applying suggestion...')
    }
  }

  const handleQuickAction = (action) => {
    const actions = {
      generate: 'Generate initial BRD from uploaded documents',
      scrape: '/scrape competitor.com',
      conflicts: 'Check for conflicting requirements',
      metrics: 'Suggest appropriate success metrics'
    }
    setMessage(actions[action])
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
        <p className="text-sm text-gray-500">Chat to refine your BRD</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 mx-auto text-blue-500 mb-3" />
            <p className="text-gray-600 mb-4">How can I help you today?</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => handleQuickAction('generate')}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition-colors"
              >
                Generate BRD
              </button>
              <button
                onClick={() => handleQuickAction('conflicts')}
                className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm rounded-lg hover:bg-purple-100 transition-colors"
              >
                Check Conflicts
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
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.role === 'assistant' && (
                <Sparkles className="inline w-4 h-4 mr-2 text-blue-500" />
              )}
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.suggestions.map((sug, i) => (
                    <div
                      key={i}
                      className="bg-white rounded p-3 border border-blue-200"
                    >
                      <p className="text-sm text-gray-700 mb-2">{sug.text}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSuggestionAccept(sug)}
                          className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                        >
                          ✓ Accept
                        </button>
                        <button className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors">
                          ✗ Decline
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
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => handleQuickAction('scrape')}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            <Globe className="w-3 h-3" />
            Scrape
          </button>
          <button
            onClick={() => handleQuickAction('conflicts')}
            className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            ⚠️ Conflicts
          </button>
          <button
            onClick={() => handleQuickAction('metrics')}
            className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            📊 Metrics
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message or command..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}