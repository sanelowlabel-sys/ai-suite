import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import AuthModal from './components/AuthModal';

import Home from './pages/Home';
import Tools from './pages/Tools';
import ToolDetail from './pages/ToolDetail';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white text-slate-900 selection:bg-red-600 selection:text-white grid-pattern-bg flex flex-col">
          <Navigation />
          <AuthModal />
          
          <main className="lg:ml-72 pt-16 flex-1 min-h-[calc(100vh-64px)]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/tools/:id" element={<ToolDetail />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          
          <footer className="lg:ml-72 border-t border-slate-200 bg-white py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-sm shadow-red-500/30">
                    AI
                  </div>
                  <span className="text-xl font-black tracking-tight text-slate-900">
                    AI <span className="text-red-600">SUITE</span>
                  </span>
                </div>
                <p className="text-slate-600 text-sm max-w-sm leading-relaxed">
                  Next-generation studio platform equipped with specialized intelligence for music production, SEO discovery, and content creation.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4">Platform</h4>
                <ul className="space-y-2.5 text-sm font-medium text-slate-600">
                  <li><Link to="/tools" className="hover:text-red-600 transition-colors">Tools Directory</Link></li>
                  <li><Link to="/tools?category=Music" className="hover:text-red-600 transition-colors">Audio & Music Lab</Link></li>
                  <li><Link to="/pricing" className="hover:text-red-600 transition-colors">Membership & Pricing</Link></li>
                  <li><Link to="/dashboard" className="hover:text-red-600 transition-colors">Creator Dashboard</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4">Support & Trust</h4>
                <ul className="space-y-2.5 text-sm font-medium text-slate-600">
                  <li><span className="text-slate-500">PayPal Verified Merchant</span></li>
                  <li><span className="text-slate-500">99.9% Production Uptime</span></li>
                  <li><span className="text-slate-500">Zero Audio Artifacts</span></li>
                  <li><span className="text-slate-500">Terms & Privacy Compliant</span></li>
                </ul>
              </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
              <div>© 2026 AI Suite Inc. All rights reserved.</div>
              <div className="flex items-center gap-6">
                <span className="hover:text-red-600 transition-colors cursor-pointer">Privacy Policy</span>
                <span className="hover:text-red-600 transition-colors cursor-pointer">Terms of Service</span>
                <span className="hover:text-red-600 transition-colors cursor-pointer">Status</span>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
