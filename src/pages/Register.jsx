import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import API from '../api/axios'

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await API.post('/auth/register', form)

      setSuccess('Registered! Redirecting to login...')

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Create account 🚀
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          Join Password K today
        </p>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-900/40 border border-emerald-700 text-emerald-300 text-sm rounded-lg px-4 py-3 mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="text-gray-400 text-sm block mb-1">
              Username
            </label>

            <input
              type="text"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              placeholder="your username"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-400 text-sm block mb-1">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="you@email.com"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-400 text-sm block mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:border-emerald-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute inset-y-0 right-3 flex items-center text-black"
              >
                {showPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          Have an account?{' '}
          <Link
            to="/login"
            className="text-emerald-400 hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}