import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/auth/register', form)
      setSuccess('Registered! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Create account 🚀</h2>
        <p className="text-gray-400 text-sm mb-6">Join Password K today</p>

        {error && <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
        {success && <div className="bg-emerald-900/40 border border-emerald-700 text-emerald-300 text-sm rounded-lg px-4 py-3 mb-4">{success}</div>}

        <div className="space-y-4">
          {['username', 'email', 'password'].map(field => (
            <div key={field}>
              <label className="text-gray-400 text-sm block mb-1 capitalize">{field}</label>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                placeholder={field === 'email' ? 'you@email.com' : field === 'password' ? '••••••••' : 'your username'}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          ))}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </div>

        <p className="text-gray-500 text-sm text-center mt-6">
          Have an account? <Link to="/login" className="text-emerald-400 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  )
}