import { useState } from 'react';
import { Code, FileCode, Info, Search, Wand2, LogOut, Copy, Check } from 'lucide-react';

interface CodeReviewInterfaceProps {
  onLogout: () => void;
}

export default function CodeReviewInterface({ onLogout }: CodeReviewInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'review' | 'rewrite' | 'howto'>('review');
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [focusAreas, setFocusAreas] = useState({
    bugs: true,
    security: true,
    performance: true,
    bestPractices: true,
  });
  const [reviewResult, setReviewResult] = useState<any>(null);
  const [rewriteResult, setRewriteResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedReview, setCopiedReview] = useState(false);
  const [copiedRewrite, setCopiedRewrite] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const handleReviewCode = async () => {
    if (!code.trim()) {
      alert('Please enter code to review');
      return;
    }

    setLoading(true);
    setReviewResult(null);

    try {
      const areas = [];
      if (focusAreas.bugs) areas.push('Bugs');
      if (focusAreas.security) areas.push('Security');
      if (focusAreas.performance) areas.push('Performance');
      if (focusAreas.bestPractices) areas.push('Best Practices');

      const response = await fetch(`${supabaseUrl}/functions/v1/code-review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          focus_areas: areas,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to review code');
      }

      const data = await response.json();
      setReviewResult(data);
    } catch (error) {
      console.error('Error reviewing code:', error);
      alert('Failed to review code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRewriteCode = async () => {
    if (!code.trim()) {
      alert('Please enter code to rewrite');
      return;
    }

    setLoading(true);
    setRewriteResult(null);
    setActiveTab('rewrite');

    try {
      const areas = [];
      if (focusAreas.bugs) areas.push('Bugs');
      if (focusAreas.security) areas.push('Security');
      if (focusAreas.performance) areas.push('Performance');
      if (focusAreas.bestPractices) areas.push('Best Practices');

      const response = await fetch(`${supabaseUrl}/functions/v1/code-rewrite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          focus_areas: areas,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to rewrite code');
      }

      const data = await response.json();
      setRewriteResult(data);
    } catch (error) {
      console.error('Error rewriting code:', error);
      alert('Failed to rewrite code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'review' | 'rewrite') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'review') {
        setCopiedReview(true);
        setTimeout(() => setCopiedReview(false), 2000);
      } else {
        setCopiedRewrite(true);
        setTimeout(() => setCopiedRewrite(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const toggleFocusArea = (area: keyof typeof focusAreas) => {
    setFocusAreas((prev) => ({ ...prev, [area]: !prev[area] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🤖</div>
            <div>
              <h1 className="text-xl font-bold text-white">Code Review Agent</h1>
              <p className="text-xs text-slate-400">Powered by AI</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">API Connected</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 mb-3">
            Intelligent Code Review & Rewrite
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Get instant feedback on your code. Identify bugs, performance issues, security
            vulnerabilities, and best practices. Then automatically rewrite it to fix everything.
          </p>
        </div>

        <div className="flex gap-2 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
              activeTab === 'review'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Search size={18} />
            Code Review
          </button>
          <button
            onClick={() => setActiveTab('rewrite')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
              activeTab === 'rewrite'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Wand2 size={18} />
            Rewritten Code
          </button>
          <button
            onClick={() => setActiveTab('howto')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
              activeTab === 'howto'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Info size={18} />
            How It Works
          </button>
        </div>

        {activeTab === 'review' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <FileCode size={20} className="text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Your Code</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">Paste code you want reviewed</p>

              <div className="mb-4">
                <label className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                  <Code size={16} />
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="csharp">C#</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                  <FileCode size={16} />
                  Code
                </label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                  className="w-full h-64 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
                />
              </div>

              <div className="mb-6">
                <label className="text-slate-300 text-sm mb-3 block">Focus Areas</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={focusAreas.bugs}
                      onChange={() => toggleFocusArea('bugs')}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-300">Bugs</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={focusAreas.performance}
                      onChange={() => toggleFocusArea('performance')}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-300">Performance</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={focusAreas.security}
                      onChange={() => toggleFocusArea('security')}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-300">Security</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={focusAreas.bestPractices}
                      onChange={() => toggleFocusArea('bestPractices')}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-300">Best Practices</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleReviewCode}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Search size={20} />
                  {loading && activeTab === 'review' ? 'Reviewing...' : 'Review Code'}
                </button>
                <button
                  onClick={handleRewriteCode}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Wand2 size={20} />
                  {loading && activeTab === 'rewrite' ? 'Rewriting...' : 'Fix & Rewrite Code'}
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileCode size={20} className="text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">Review Results</h3>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-6">Detailed analysis and recommendations</p>

              {reviewResult && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-red-500/20">
                      <div className="text-xs text-slate-400 mb-1">Critical</div>
                      <div className="text-2xl font-bold text-red-400">{reviewResult.critical_count}</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-orange-500/20">
                      <div className="text-xs text-slate-400 mb-1">High</div>
                      <div className="text-2xl font-bold text-orange-400">{reviewResult.high_count}</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-yellow-500/20">
                      <div className="text-xs text-slate-400 mb-1">Medium</div>
                      <div className="text-2xl font-bold text-yellow-400">{reviewResult.medium_count}</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-green-500/20">
                      <div className="text-xs text-slate-400 mb-1">Low</div>
                      <div className="text-2xl font-bold text-green-400">{reviewResult.low_count}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4 text-sm">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-full">
                      Review
                    </button>
                    <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full">
                      Suggestions
                    </button>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600 max-h-96 overflow-y-auto prose prose-invert prose-sm max-w-none">
                    <div className="text-slate-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatMarkdown(reviewResult.review) }} />
                  </div>

                  <button
                    onClick={() => copyToClipboard(reviewResult.review, 'review')}
                    className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {copiedReview ? <Check size={16} /> : <Copy size={16} />}
                    {copiedReview ? 'Copied!' : 'Copy Review'}
                  </button>
                </>
              )}

              {!reviewResult && !loading && (
                <div className="text-center py-12 text-slate-500">
                  <Search size={48} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">
                    You haven't provided the {language} code for review. Please provide the code, and I'll be happy to assist you with a detailed review. If you provide the code, I'll analyze it and provide a review in the requested format, focusing on bugs, performance, security, and best practices. I'll also include specific suggestions for improvement. Please paste the {language} code, and I'll get started on the review. I'll make sure to follow the format you requested.
                  </p>
                </div>
              )}

              {loading && activeTab === 'review' && (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-slate-400">Analyzing your code...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rewrite' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Code size={20} className="text-red-400" />
                <h3 className="text-lg font-semibold text-white">Original Code</h3>
              </div>
              <pre className="bg-slate-900/50 rounded-lg p-4 border border-slate-600 max-h-96 overflow-auto">
                <code className="text-sm text-slate-300 font-mono">{code}</code>
              </pre>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Code size={20} className="text-green-400" />
                <h3 className="text-lg font-semibold text-white">Rewritten Code</h3>
              </div>

              {rewriteResult && (
                <>
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600 max-h-96 overflow-auto prose prose-invert prose-sm max-w-none mb-4">
                    <div className="text-slate-300" dangerouslySetInnerHTML={{ __html: formatMarkdown(rewriteResult.rewrite) }} />
                  </div>
                  <button
                    onClick={() => copyToClipboard(rewriteResult.rewrite, 'rewrite')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {copiedRewrite ? <Check size={16} /> : <Copy size={16} />}
                    {copiedRewrite ? 'Copied!' : 'Copy Rewritten Code'}
                  </button>
                </>
              )}

              {!rewriteResult && !loading && (
                <div className="text-center py-12 text-slate-500">
                  <Wand2 size={48} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Click "Fix & Rewrite Code" to get an optimized version</p>
                </div>
              )}

              {loading && activeTab === 'rewrite' && (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-slate-400">Rewriting your code...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'howto' && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">1️⃣</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Paste Your Code</h4>
                <p className="text-sm text-slate-400">
                  Select your programming language and paste the code you want reviewed.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">2️⃣</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Get Instant Review</h4>
                <p className="text-sm text-slate-400">
                  AI analyzes your code for bugs, security flaws, and best practices.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">3️⃣</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Auto-Rewrite</h4>
                <p className="text-sm text-slate-400">
                  Get production-ready code that fixes all identified issues automatically.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function formatMarkdown(text: string): string {
  return text
    .replace(/###\s*🔴\s*(.*)/g, '<h3 style="color: #f87171; margin-top: 1.5rem; margin-bottom: 0.75rem;">🔴 $1</h3>')
    .replace(/###\s*🟠\s*(.*)/g, '<h3 style="color: #fb923c; margin-top: 1.5rem; margin-bottom: 0.75rem;">🟠 $1</h3>')
    .replace(/###\s*🟡\s*(.*)/g, '<h3 style="color: #fbbf24; margin-top: 1.5rem; margin-bottom: 0.75rem;">🟡 $1</h3>')
    .replace(/###\s*🟢\s*(.*)/g, '<h3 style="color: #4ade80; margin-top: 1.5rem; margin-bottom: 0.75rem;">🟢 $1</h3>')
    .replace(/###\s*(.*)/g, '<h3 style="color: #60a5fa; margin-top: 1.5rem; margin-bottom: 0.75rem;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre style="background: #1e293b; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 0.5rem 0;"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code style="background: #334155; padding: 0.2rem 0.4rem; border-radius: 0.25rem;">$1</code>')
    .replace(/\n/g, '<br/>');
}
