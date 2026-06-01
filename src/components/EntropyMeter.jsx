export default function EntropyMeter({ password }) {
  function calcEntropy(str) {
    if (!str) return 0
    const freq = {}
    for (const ch of str) freq[ch] = (freq[ch] || 0) + 1
    const len = str.length
    return -Object.values(freq).reduce((sum, f) => {
      const p = f / len
      return sum + p * Math.log2(p)
    }, 0) * len
  }

  const entropy = calcEntropy(password)
  const max = 100
  const pct = Math.min((entropy / max) * 100, 100)

  const level =
    pct < 25 ? { label: 'Very Weak', color: 'bg-red-500' } :
    pct < 50 ? { label: 'Weak', color: 'bg-orange-400' } :
    pct < 70 ? { label: 'Good', color: 'bg-yellow-400' } :
    pct < 85 ? { label: 'Strong', color: 'bg-emerald-400' } :
               { label: 'Very Strong 🔥', color: 'bg-emerald-500' }

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Entropy Score</span>
        <span className="font-medium">{level.label} — {entropy.toFixed(1)} bits</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${level.color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}