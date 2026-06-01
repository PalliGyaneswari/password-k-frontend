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

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Password <span className="text-emerald-400">K</span> Transformer
          </h1>
          <p className="text-gray-400 text-sm">AI-powered password transformation engine</p>
        </div>

        {/* Input */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
          <label className="text-gray-400 text-sm block mb-2">
            Your input <span className="text-emerald-400">(try: "h h mypassword")</span>
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={3}
            placeholder="Enter your password input here..."
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 resize-none"
          />
          <EntropyMeter password={input} />
          <div className="flex gap-3 mt-4">
            <button onClick={handleTransform} disabled={loading || !input.trim()}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-medium py-3 rounded-lg transition-colors">
              {loading ? '⚙️ Transforming...' : '🔐 Transform'}
            </button>
            <button onClick={handleSuggest} disabled={aiLoading || !input.trim()}
              className="flex-1 bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white font-medium py-3 rounded-lg transition-colors">
              {aiLoading ? '🤖 Thinking...' : '💡 AI Suggest'}
            </button>
          </div>
        </div>

        {error && <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}

        {/* AI Suggestions */}
        {suggestions && (
          <div className="bg-gray-900 border border-purple-800 rounded-2xl p-6 mb-4">
            <h3 className="text-purple-400 font-semibold text-sm uppercase tracking-wide mb-4">🤖 AI Smart Suggestions</h3>
            <div className="space-y-3">
              {suggestions.map((s, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-4">
                  <code className="text-emerald-300 text-sm font-mono block mb-1">{s.input}</code>
                  <p className="text-gray-400 text-xs">{s.reason}</p>
                  <button onClick={() => { setInput(s.input); setSuggestions(null) }}
                    className="mt-2 text-xs text-purple-400 hover:text-purple-300">
                    Use this input →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transform Result */}
        {result && (
          <div className="bg-gray-900 border border-emerald-800 rounded-2xl p-6 mb-4 space-y-4">
            <h3 className="text-emerald-400 font-semibold text-sm uppercase tracking-wide">Transformation Result</h3>
            <div>
              <p className="text-gray-500 text-xs mb-1">Transformed Password</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 bg-gray-800 text-emerald-300 text-sm px-4 py-3 rounded-lg font-mono break-all">
                  {result.transformed}
                </code>
                <button onClick={copyToClipboard}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-3 rounded-lg">
                  {copied ? '✅' : '📋'}
                </button>
              </div>
              <EntropyMeter password={result.transformed} />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">SHA256</p>
              <code className="block bg-gray-800 text-gray-400 text-xs px-4 py-3 rounded-lg break-all font-mono">
                {result.sha256}
              </code>
            </div>
            <button onClick={handleAIAnalyze} disabled={aiLoading}
              className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white font-medium py-3 rounded-lg transition-colors">
              {aiLoading ? '🤖 Analyzing...' : '🧠 Analyze with AI'}
            </button>
          </div>
        )}

        {/* AI Analysis */}
        {aiAnalysis && (
          <div className="bg-gray-900 border border-purple-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-purple-400 font-semibold text-sm uppercase tracking-wide">🧠 AI Security Analysis</h3>

            {/* Score */}
            <div className="flex items-center justify-between bg-gray-800 rounded-xl p-4">
              <div>
                <p className="text-gray-400 text-xs mb-1">Overall Score</p>
                <p className={`text-4xl font-bold ${scoreColor(aiAnalysis.overallScore)}`}>
                  {aiAnalysis.overallScore}<span className="text-lg">/100</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs mb-1">Strength</p>
                <p className="text-white font-semibold">{aiAnalysis.strengthLevel}</p>
                <p className="text-gray-500 text-xs mt-1">{aiAnalysis.entropyBits} entropy bits</p>
              </div>
            </div>

            {/* Analysis */}
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">Detailed Analysis</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(aiAnalysis.analysis).map(([key, val]) => (
                  <div key={key} className="bg-gray-800 rounded-xl p-3">
                    <p className="text-gray-500 text-xs capitalize mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-gray-300 text-xs">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Attack Simulation */}
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">⚔️ Attack Simulation</p>
              <div className="space-y-2">
                {Object.entries(aiAnalysis.attackSimulation).map(([key, val]) => (
                  <div key={key} className="flex justify-between bg-gray-800 rounded-lg px-4 py-3">
                    <span className="text-gray-500 text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-gray-300 text-xs text-right max-w-xs">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Flags */}
            {aiAnalysis.riskFlags?.length > 0 && (
              <div>
                <p className="text-red-400 text-xs uppercase tracking-wide mb-2">⚠️ Risk Flags</p>
                {aiAnalysis.riskFlags.map((flag, i) => (
                  <div key={i} className="bg-red-900/20 border border-red-800 rounded-lg px-4 py-2 mb-2">
                    <p className="text-red-300 text-xs">{flag}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Suggestions */}
            <div>
              <p className="text-emerald-400 text-xs uppercase tracking-wide mb-2">💡 AI Recommendations</p>
              {aiAnalysis.suggestions.map((s, i) => (
                <div key={i} className="bg-emerald-900/20 border border-emerald-900 rounded-lg px-4 py-2 mb-2">
                  <p className="text-emerald-300 text-xs">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}