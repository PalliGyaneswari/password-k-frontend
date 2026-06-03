import { useEffect, useState } from 'react'
import API from '../api/axios'

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    API.get('/password/history')
      .then(res => setHistory(res.data.history))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function copyText(text, index) {
    navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 md:py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            📜 Transformation History
          </h1>
          <p className="text-gray-400 text-sm">Your last 20 password transformations</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3 animate-spin">⚙️</div>
            <p className="text-gray-500 text-sm">Loading history...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && history.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">🔐</div>
            <p className="text-gray-400 font-medium mb-2">No transformations yet</p>
            <p className="text-gray-600 text-sm">
              Go to the Transform page and create your first secure password!
            </p>
          </div>
        )}

        {/* History List */}
        <div className="space-y-4">
          {history.map((item, i) => (
            <div key={i}
              className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-4 md:p-5 transition-all">

              {/* Top Row */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500">
                  🕐 {new Date(item.created_at).toLocaleString()}
                </span>
                <span className="text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-800/50 px-2.5 py-1 rounded-full font-medium">
                  transformed ✓
                </span>
              </div>

              <div className="space-y-3">

                {/* Original Input */}
                <div>
                  <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">
                    Original Input
                  </p>
                  <code className="text-gray-300 text-sm font-mono break-all">
                    {item.original_input}
                  </code>
                </div>

                {/* Transformed */}
                <div>
                  <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">
                    Transformed
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-emerald-400 text-sm font-mono break-all">
                      {item.transformed}
                    </code>
                    <button
                      onClick={() => copyText(item.transformed, i)}
                      className={`flex-shrink-0 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                        copied === i
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                      }`}>
                      {copied === i ? '✅ Copied' : '📋 Copy'}
                    </button>
                  </div>
                </div>

                {/* SHA256 */}
                <div>
                  <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">
                    SHA256
                  </p>
                  <code className="text-gray-600 text-xs font-mono break-all leading-relaxed">
                    {item.sha256_hash}
                  </code>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}