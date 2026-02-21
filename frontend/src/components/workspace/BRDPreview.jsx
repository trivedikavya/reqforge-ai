import React, { useState } from 'react'
import { Download, FileText, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'
import api from '../../api/axios'

export default function BRDPreview({ brd, projectId }) {
  const [copied, setCopied] = useState(false)

  const handleExport = async (format) => {
    try {
      toast.loading(`Generating ${format.toUpperCase()}...`, { id: 'export-toast' })

      const response = await api.post(
        `/api/brd/${projectId}/export`,
        { format },
        { responseType: 'blob' }
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `BRD_${projectId}.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast.success('Export completed!', { id: 'export-toast' })
    } catch (error) {
      toast.error('Export failed', { id: 'export-toast' })
      console.error(error)
    }
  }

  const handleCopy = () => {
    if (brd && brd.content) {
      const contentStr = typeof brd.content === 'string' ? brd.content : JSON.stringify(brd.content, null, 2)
      navigator.clipboard.writeText(contentStr)
      setCopied(true)
      toast.success('Copied to clipboard!', {
        style: { background: '#1a1a1a', color: '#CCFF00', border: '1px solid rgba(204,255,0,0.2)' }
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="h-full flex flex-col min-h-0 bg-deepBlack/50 relative">
      {/* Sticky Header Toolbar */}
      <div className="px-5 py-3 border-b border-white/10 flex justify-between items-center bg-[#181818]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neonGreen/10 flex items-center justify-center border border-neonGreen/20">
            <FileText className="w-4 h-4 text-neonGreen" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wider uppercase">Live Document</h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 text-gray-300 text-xs font-semibold rounded-lg hover:bg-white/10 hover:text-white transition-all border border-white/10"
            title="Copy to Clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-neonGreen" /> : <Copy className="w-4 h-4" />}
            {copied ? 'COPIED' : 'COPY'}
          </button>

          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 text-gray-300 text-xs font-semibold rounded-lg hover:bg-white/10 hover:text-white transition-all border border-white/10"
          >
            <Download className="w-3 h-3" /> PDF
          </button>

          <button
            onClick={() => handleExport('docx')}
            className="flex items-center gap-2 px-3 py-1.5 bg-neonGreen text-deepBlack text-xs font-bold rounded-lg hover:bg-[#b0d900] shadow-[0_0_15px_rgba(204,255,0,0.2)] transition-all"
          >
            <FileText className="w-3 h-3" /> DOCX
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 p-8 text-gray-300 relative z-10 overflow-y-auto custom-scrollbar">
        {brd && brd.content ? (
          <div className="prose prose-invert prose-neon max-w-none">
            <ReactMarkdown>
              {typeof brd.content === 'string' ? brd.content : JSON.stringify(brd.content, null, 2)}
            </ReactMarkdown>

            {brd.conflicts && brd.conflicts.length > 0 && (
              <div className="mt-12 p-5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
                <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-sm">⚠️</span>
                  Conflicts Detected
                </h3>
                <ul className="list-disc list-outside ml-6 text-gray-400 space-y-2 marker:text-yellow-500/50">
                  {brd.conflicts.map((conflict, i) => (
                    <li key={i} className="pl-1 leading-relaxed">{conflict.description}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 animate-pulse shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <FileText className="w-10 h-10 text-white/20" />
            </div>
            <p className="text-white text-xl font-bold mb-3 tracking-tight">Awaiting Generation</p>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
              Upload context or instruct the AI via chat to begin forging your requirements document.
            </p>
          </div>
        )}
      </div>

      {/* Custom Typography Overrides specifically for this container */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .prose-neon h1, .prose-neon h2, .prose-neon h3 {
          color: white;
          font-weight: 700;
          letter-spacing: -0.025em;
        }
        .prose-neon h1 { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
        .prose-neon a { color: #CCFF00; text-decoration: none; border-bottom: 1px dashed rgba(204,255,0,0.5); }
        .prose-neon a:hover { color: white; border-bottom-color: white; }
        .prose-neon strong { color: white; }
        .prose-neon blockquote { border-left-color: #CCFF00; background: rgba(204,255,0,0.05); padding: 1rem; border-radius: 0 0.5rem 0.5rem 0; }
        .prose-neon code { color: #CCFF00; background: rgba(204,255,0,0.1); padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.875em; }
        .prose-neon pre { background: #111; border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; }
        .prose-neon pre code { color: #e2e8f0; background: transparent; padding: 0; }
        .prose-neon ul li::marker { color: #CCFF00; }
      `}} />
    </div>
  )
}