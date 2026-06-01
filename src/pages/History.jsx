import { useEffect, useState } from 'react'
import API from '../api/axios'

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/password/history')
      .then(res => setHistory(res.data.history))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Transformation History</h1>
        <p className="text-gray-400 text-sm mb-8">Your last 20 password transformations</p>

        {loading && <p className="text-gray-500 text-sm">Loading...</p>}

        {!loading && history.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <p className="text-gray-500">No history yet. Go transform a password!</p>
          </div>
        )}

        <div className="space-y-4">
          {history.map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-gray-500">
                  {new Date(item.created_at).toLocaleString()}
                </span>
                <span className="text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">
                  transformed
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-gray-600 text-xs mb-0.5">Input</p>
                  <code className="text-gray-300 text-sm font-mono">{item.original_input}</code>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-0.5">Transformed</p>
                  <code className="text-emerald-400 text-sm font-mono">{item.transformed}</code>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-0.5">SHA256</p>
                  <code className="text-gray-500 text-xs font-mono break-all">{item.sha256_hash}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}