import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, FileText, Zap, Users, CheckCircle, Sparkles, Brain, Globe } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  // Smooth scroll logic
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-deepBlack text-white selection:bg-neonGreen selection:text-deepBlack overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neonGreen/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 bg-deepBlack/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-neonGreen rounded-lg flex items-center justify-center bg-deepBlack/50 shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                  <span className="text-neonGreen font-bold text-xl">R</span>
                </div>
                <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  ReqForge <span className="text-neonGreen">AI</span>
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 bg-neonGreen text-deepBlack font-bold rounded-lg hover:bg-[#b0d900] transition-all shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:shadow-[0_0_30px_rgba(204,255,0,0.6)] hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center group">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 bg-white/5 border border-white/10 backdrop-blur-sm text-gray-300 group-hover:border-neonGreen/30 transition-colors">
              <Sparkles className="w-4 h-4 text-neonGreen" />
              Powered by Google Gemini AI
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Design the Future, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonGreen to-emerald-400 drop-shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                Forge the Requirements.
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Generate comprehensive Business Requirements Documents automatically.
              Upload context, chat with Gemini, and watch your chaos turn into clarity in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-4 bg-neonGreen text-deepBlack rounded-lg hover:bg-[#b0d900] transition-all text-lg font-bold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:shadow-[0_0_50px_rgba(204,255,0,0.5)] hover:-translate-y-1"
              >
                Start Creating BRDs
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all text-lg font-semibold border border-white/10 hover:border-white/20 hover:-translate-y-1"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-12 flex justify-center items-center gap-8 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-2 line-through opacity-50"><CheckCircle className="w-4 h-4" /> Credit card required</span>
              <span className="flex items-center gap-2 text-neonGreen/80"><CheckCircle className="w-4 h-4" /> 100% Free Tier</span>
              <span className="flex items-center gap-2 text-neonGreen/80"><CheckCircle className="w-4 h-4" /> Instant Export</span>
            </div>
          </div>
        </section>

        {/* Product Showcase (BRD Flow Demo representation) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neonGreen/5 to-transparent blur-3xl rounded-full z-0" />
          <div className="relative z-10 w-full rounded-2xl border border-white/10 bg-deepBlack/60 backdrop-blur-xl shadow-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="ml-4 text-xs text-gray-500 font-mono">reqforge-ai / workspace</div>
            </div>
            <div className="p-1">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" alt="Dashboard Preview" className="w-full h-auto opacity-70 filter contrast-125 saturate-50 mix-blend-luminosity" />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32" id="features">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold tracking-widest text-neonGreen uppercase mb-3">Enterprise Capabilities</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Everything required to scale.
            </h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built on Google's Gemini AI to deliver intelligent document generation and analysis at lightspeed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 hover:border-neonGreen/30 transition-all group">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:border-neonGreen/50 group-hover:shadow-[0_0_15px_rgba(204,255,0,0.2)]">
                <Brain className="w-7 h-7 text-neonGreen" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">AI Generation</h3>
              <p className="text-gray-400 leading-relaxed">
                Upload raw fragments: emails, unstructured notes. Our AI structurally maps and outputs a crisp, standardized BRD instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 hover:border-emerald-400/30 transition-all group">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:border-emerald-400/50 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                <FileText className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Dynamic Templates</h3>
              <p className="text-gray-400 leading-relaxed">
                Choose between Comprehensive, Standard, or Agile frameworks. Auto-tailored to fit your project's lifecycle context.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 hover:border-blue-400/30 transition-all group">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:border-blue-400/50 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.2)]">
                <Globe className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Web Intelligence</h3>
              <p className="text-gray-400 leading-relaxed">
                Scrape competitor URLs directly from chat. The AI will weave market insights directly into your requirements set.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 hover:border-purple-400/30 transition-all group">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:border-purple-400/50 group-hover:shadow-[0_0_15px_rgba(192,132,252,0.2)]">
                <Zap className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Real-Time Refining</h3>
              <p className="text-gray-400 leading-relaxed">
                Chat naturally with your workspace. Ask for compliance sections or risk matrices—watch the Markdown preview update live via WebSockets.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 hover:border-yellow-400/30 transition-all group">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:border-yellow-400/50 group-hover:shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                <Users className="w-7 h-7 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Conflict Resolution</h3>
              <p className="text-gray-400 leading-relaxed">
                Automatically identify contradictory requirements across uploaded sources and let AI suggest optimal resolution paths.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 hover:border-pink-400/30 transition-all group">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:border-pink-400/50 group-hover:shadow-[0_0_15px_rgba(244,114,182,0.2)]">
                <CheckCircle className="w-7 h-7 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Multi-Export</h3>
              <p className="text-gray-400 leading-relaxed">
                Manage limitless workspaces. Seamlessly export pristine, fully-formatted documents to PDF or DOCX with one click.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 border-t border-white/5 bg-deepBlack" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Designed for speed.
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                { step: '01', title: 'Sign Up', desc: 'Secure local or JWT based access.' },
                { step: '02', title: 'Start Project', desc: 'Select your operational template.' },
                { step: '03', title: 'Feed AI', desc: 'Upload raw data or scrape URLs.' },
                { step: '04', title: 'Deploy', desc: 'Export polished BRD to team.' }
              ].map((item, idx) => (
                <div key={idx} className="relative p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="text-5xl font-black text-white/5 absolute right-4 top-4 select-none">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-neonGreen mb-2 relative z-10">{item.title}</h3>
                  <p className="text-gray-400 text-sm relative z-10">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="relative rounded-3xl overflow-hidden border border-neonGreen/30 p-1 bg-deepBlack shadow-[0_0_50px_rgba(204,255,0,0.15)] text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-neonGreen/10 to-transparent pointer-events-none" />
            <div className="bg-deepBlack rounded-[22px] p-12 md:p-20 relative z-10 border border-white/5">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
                End the Documentation Grind.
              </h2>
              <p className="text-xl mb-10 text-gray-400 max-w-2xl mx-auto">
                Join elite product managers saving days on manual requirement gathering. Start forging your ideas instantly.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="px-10 py-5 bg-neonGreen text-deepBlack rounded-xl hover:bg-[#b0d900] transition-all text-xl font-bold inline-flex items-center gap-2 shadow-[0_0_40px_rgba(204,255,0,0.3)] hover:shadow-[0_0_60px_rgba(204,255,0,0.5)] hover:scale-105"
              >
                Launch App
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-deepBlack">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-2 border-neonGreen rounded-lg flex items-center justify-center">
                  <span className="text-neonGreen font-bold text-sm">R</span>
                </div>
                <span className="font-bold text-white tracking-widest">REQFORGE <span className="text-neonGreen">AI</span></span>
              </div>
              <p className="text-gray-500 text-sm">
                Built with React, Tailwind, & Gemini AI. HackFest 2.0
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}