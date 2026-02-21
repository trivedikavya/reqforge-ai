import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, FileText, Zap, Users, CheckCircle, Sparkles, Brain, Globe } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ReqForge AI
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Powered by Google Gemini AI
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            From Chaos to Clarity
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              in Minutes
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Generate comprehensive Business Requirements Documents automatically using AI. 
            Analyze emails, meetings, and documents to create professional BRDs instantly.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold flex items-center gap-2"
            >
              Start Creating BRDs Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-lg font-semibold border border-gray-200"
            >
              Watch Demo
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            ✨ No credit card required • 🚀 Free tier available forever
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Create Perfect BRDs
          </h2>
          <p className="text-gray-600">
            Powered by Google's Gemini AI for intelligent document generation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI-Powered Generation
            </h3>
            <p className="text-gray-600">
              Upload emails, meeting transcripts, or documents. Our AI extracts requirements and generates professional BRDs automatically.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              3 Template Options
            </h3>
            <p className="text-gray-600">
              Choose from Comprehensive, Standard, or Agile templates. Perfect for enterprise projects, startups, or quick MVPs.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Market Intelligence
            </h3>
            <p className="text-gray-600">
              Analyze competitor websites to enrich your BRD with industry insights and best practices automatically.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Real-Time Chat Editing
            </h3>
            <p className="text-gray-600">
              Refine your BRD through natural conversation. "Add GDPR compliance" or "Make timeline more aggressive" - it just works.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Conflict Detection
            </h3>
            <p className="text-gray-600">
              Automatically identify contradictory requirements across different sources and get AI-powered resolution suggestions.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Multi-Project Management
            </h3>
            <p className="text-gray-600">
              Manage unlimited BRD projects. Export to PDF or DOCX. Track progress and collaborate with your team seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Create Your First BRD in 4 Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sign Up Free</h3>
              <p className="text-gray-600 text-sm">Create your account in 30 seconds</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose Template</h3>
              <p className="text-gray-600 text-sm">Select Comprehensive, Standard, or Agile</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Upload Data</h3>
              <p className="text-gray-600 text-sm">Add emails, documents, or meeting notes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Your BRD</h3>
              <p className="text-gray-600 text-sm">AI generates your professional BRD instantly</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Get Started Now - It's Free
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Stop Writing BRDs. Start Building Products.
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of product managers saving 40+ hours per project
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
          >
            Create Your First BRD Free
          </button>
          <p className="text-sm text-blue-100 mt-4">
            Powered by Google Gemini AI • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold">ReqForge AI</span>
            </div>
            <p className="text-gray-400 mb-4">
              AI-Powered Business Requirements Document Generator
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 ReqForge AI. Built for HackFest 2.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}