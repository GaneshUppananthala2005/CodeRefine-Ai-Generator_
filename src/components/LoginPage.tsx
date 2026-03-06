import { useState } from 'react';
import { Mail, Lock, LogIn, Info } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin();
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@coderev.com');
    setPassword('password123');
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4">
              <div className="text-4xl">🤖</div>
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
              Code Review Agent
            </h1>
            <p className="text-slate-400 text-sm">
              AI-Powered Code Analysis & Rewriting
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                <Lock size={16} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25"
            >
              <LogIn size={20} />
              Sign In
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-600">
            <div className="flex items-start gap-2 mb-2">
              <Info size={16} className="text-blue-400 mt-0.5" />
              <span className="text-sm font-semibold text-slate-300">Demo Login</span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Email: <span className="text-cyan-400">demo@coderev.com</span>
            </p>
            <p className="text-xs text-slate-400 mb-3">
              Password: <span className="text-cyan-400">password123</span>
            </p>
            <button
              onClick={handleDemoLogin}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Click here for demo login
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Powered by Groq + Llama 3.3
          </p>
        </div>
      </div>
    </div>
  );
}
