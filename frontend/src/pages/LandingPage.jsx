import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Zap, Globe, MessageSquare, ArrowRight, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <div className="flex items-center space-x-2 text-blue-600 font-bold text-2xl">
          <FileText size={32} />
          <span>ReqForge AI</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Log in</Link>
          <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-8 py-20 text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Turn Chaos into <span className="text-blue-600">Perfect Requirements</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 leading-relaxed">
          ReqForge AI scrapes your website, analyzes Slack, and listens to meetings to generate professional Business Requirements Documents in seconds.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center hover:bg-blue-700 shadow-lg">
            Start Free Project <ArrowRight className="ml-2" />
          </Link>
        </div>
      </header>

      {/* Features Grid */}
      <section className="px-8 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Globe className="text-blue-500" />}
            title="Smart Web Scraping"
            desc="Input your URL and our agent automatically extracts business context and features."
          />
          <FeatureCard 
            icon={<MessageSquare className="text-purple-500" />}
            title="Channel Integration"
            desc="Sync with Slack, Gmail, and meeting transcripts to capture every requirement."
          />
          <FeatureCard 
            icon={<Zap className="text-yellow-500" />}
            title="AI Generation"
            desc="Choose between Agile, Standard, or Comprehensive templates for instant BRDs."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}