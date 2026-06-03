import { useState } from 'react'
import API from '../api/axios'
import EntropyMeter from '../components/EntropyMeter'

export default function Transform() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [suggestions, setSuggestions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  async function handleTransform() {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    setAiAnalysis(null)
    try {
      const res = await API.post('/password/transform', { input })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Transformation failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleAIAnalyze() {
    if (!result) return
    setAiLoading(true)
    try {
      const res = await API.post('/ai/analyze', {
        originalInput: input,
        transformedPassword: result.transformed
      })
      setAiAnalysis(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setAiLoading(false)
    }
  }

  async function handleSuggest() {
    if (!input.trim()) return
    setAiLoading(true)
    try {
      const res = await API.post('/ai/suggest', { input })
      setSuggestions(res.data.suggestions)
    } catch (err) {
      console.error(err)
    } finally {
      setAiLoading(false)
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(result.transformed)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scoreColor = (score) =>
    score < 40 ? 'text-red-400' :
    score < 65 ? 'text-yellow-400' :
    score < 85 ? 'text-emerald-400' : 'text-emerald-300'

  const scoreBg = (score) =>
    score < 40 ? 'bg-red-500' :
    score < 65 ? 'bg-yellow-400' :
    score < 85 ? 'bg-emerald-400' : 'bg-emerald-300'

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 md:py-12">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-6 md:mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-900/30 border border-emerald-800 rounded-full px-4 py-1.5 mb-4">
            <span className="text-emerald-400 text-xs font-medium">🔐 AI-Powered Security</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Password <span className="text-emerald-400">K</span> Transformer
          </h1>
          <p className="text-gray-400 text-sm">
            Transform your input into a cryptographically strengthened password
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 md:p-6 mb-4">
          <label className="text-gray-400 text-xs font-medium uppercase tracking-wider block mb-2">
            Your Input
          </label>
          <p className="text-emerald-400/70 text-xs mb-3">
            💡 Try: "h h mypassword" — patterns like "x x" get transformed!
          </p>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={3}
            placeholder="Enter your password input here..."
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 resize-none transition-all"
          />
          <EntropyMeter password={input} />

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={handleTransform}
              disabled={loading || !input.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-sm">
              {loading
                ? <><span className="animate-spin">⚙️</span> Transforming...</>
                : <><span>🔐</span> Transform Password</>}
            </button>
            <button
              onClick={handleSuggest}
              disabled={aiLoading || !input.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-sm">
              {aiLoading
                ? <><span>🤖</span> Thinking...</>
                : <><span>💡</span> AI Suggest</>}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {suggestions && (
          <div className="bg-gray-900 border border-purple-800/50 rounded-2xl p-4 md:p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span>🤖</span>
              <h3 className="text-purple-400 font-semibold text-sm uppercase tracking-wider">
                AI Smart Suggestions
              </h3>
            </div>
            <div className="space-y-3">
              {suggestions.map((s, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <code className="text-emerald-300 text-sm font-mono break-all">{s.input}</code>
                    <button
                      onClick={() => { setInput(s.input); setSuggestions(null) }}
                      className="text-xs bg-purple-700 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg whitespace-nowrap transition-all">
                      Use this →
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{s.reason}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setSuggestions(null)}
              className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">
              ✕ Dismiss
            </button>
          </div>
        )}

        {result && (
          <div className="bg-gray-900 border border-emerald-800/50 rounded-2xl p-4 md:p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span>✅</span>
              <h3 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">
                Transformation Result
              </h3>
            </div>

            <div className="mb-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Transformed Password</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-800 border border-gray-700 text-emerald-300 text-sm px-4 py-3 rounded-xl font-mono break-all leading-relaxed">
                  {result.transformed}
                </code>
                <button onClick={copyToClipboard}
                  className={`flex-shrink-0 flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl border transition-all text-xs font-medium ${
                    copied
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                  }`}>
                  <span className="text-lg">{copied ? '✅' : '📋'}</span>
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <EntropyMeter password={result.transformed} />
            </div>

            <div className="mb-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">SHA256 Fingerprint</p>
              <code className="block bg-gray-800 border border-gray-700 text-gray-400 text-xs px-4 py-3 rounded-xl break-all font-mono leading-relaxed">
                {result.sha256}
              </code>
            </div>

            <div className="mb-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Session Salt</p>
              <code className="block bg-gray-800 border border-gray-700 text-gray-400 text-xs px-4 py-3 rounded-xl break-all font-mono">
                {result.sessionSalt}
              </code>
            </div>

            <button onClick={handleAIAnalyze} disabled={aiLoading}
              className="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all text-sm">
              {aiLoading
                ? <><span>🤖</span> Analyzing...</>
                : <><span>🧠</span> Analyze with AI</>}
            </button>
          </div>
        )}

        {aiAnalysis && (
          <div className="bg-gray-900 border border-purple-800/50 rounded-2xl p-4 md:p-6 space-y-5">
            <div className="flex items-center gap-2">
              <span>🧠</span>
              <h3 className="text-purple-400 font-semibold text-sm uppercase tracking-wider">
                AI Security Analysis
              </h3>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Overall Score</p>
                  <p className={`text-4xl font-bold ${scoreColor(aiAnalysis.overallScore)}`}>
                    {aiAnalysis.overallScore}
                    <span className="text-lg text-gray-500">/100</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Strength</p>
                  <p className="text-white font-semibold text-sm">{aiAnalysis.strengthLevel}</p>
                  <p className="text-gray-500 text-xs mt-1">{aiAnalysis.entropyBits} bits</p>
                </div>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${scoreBg(aiAnalysis.overallScore)}`}
                  style={{ width: `${aiAnalysis.overallScore}%` }} />
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Detailed Analysis</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(aiAnalysis.analysis).map(([key, val]) => (
                  <div key={key} className="bg-gray-800 rounded-xl p-3 border border-gray-700">
                    <p className="text-gray-500 text-xs capitalize mb-1">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <p className="text-gray-300 text-xs leading-relaxed">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">⚔️ Attack Simulation</p>
              <div className="space-y-2">
                {Object.entries(aiAnalysis.attackSimulation).map(([key, val]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:justify-between bg-gray-800 rounded-xl px-4 py-3 border border-gray-700 gap-1">
                    <span className="text-gray-500 text-xs font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-gray-300 text-xs leading-relaxed">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {aiAnalysis.riskFlags?.length > 0 && (
              <div>
                <p className="text-red-400 text-xs uppercase tracking-wider mb-2">⚠️ Risk Flags</p>
                {aiAnalysis.riskFlags.map((flag, i) => (
                  <div key={i} className="bg-red-900/20 border border-red-800/50 rounded-xl px-4 py-3 mb-2">
                    <p className="text-red-300 text-xs leading-relaxed">{flag}</p>
                  </div>
                ))}
              </div>
            )}

            <div>
              <p className="text-emerald-400 text-xs uppercase tracking-wider mb-2">💡 Recommendations</p>
              {aiAnalysis.suggestions.map((s, i) => (
                <div key={i} className="bg-emerald-900/20 border border-emerald-900/50 rounded-xl px-4 py-3 mb-2">
                  <p className="text-emerald-300 text-xs leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}