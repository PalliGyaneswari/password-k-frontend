import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">

        <Link to="/transform" className="flex items-center gap-2">
          <span className="text-2xl">🔐</span>
          <span className="text-white font-bold text-lg tracking-wide">
            Password <span className="text-emerald-400">K</span>
          </span>
        </Link>

        {user && (
          <div className="hidden md:flex items-center gap-2">
            <Link to="/transform"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/transform')
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}>
              <span>⚡</span> Transform
            </Link>
            <Link to="/history"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/history')
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}>
              <span>📜</span> History
            </Link>
            <div className="w-px h-6 bg-gray-700 mx-2" />
            <span className="text-emerald-400 text-sm font-medium">
              👤 {user.username}
            </span>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 ml-2 bg-red-600/20 hover:bg-red-600 border border-red-600/50 hover:border-red-600 text-red-400 hover:text-white text-sm px-4 py-2 rounded-lg transition-all duration-200">
              <span>🚪</span> Logout
            </button>
          </div>
        )}

        {user && (
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-400 hover:text-white p-2 text-xl">
            {menuOpen ? '✕' : '☰'}
          </button>
        )}

        {!user && (
          <div className="flex gap-3">
            <Link to="/login"
              className="text-gray-400 hover:text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-all">
              Login
            </Link>
            <Link to="/register"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-lg transition-all">
              Register
            </Link>
          </div>
        )}
      </div>

      {user && menuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-3 space-y-2">
          <div className="text-emerald-400 text-sm font-medium py-2 border-b border-gray-800 mb-2">
            👤 {user.username}
          </div>
          <Link to="/transform" onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              isActive('/transform') ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}>
            <span>⚡</span> Transform Password
          </Link>
          <Link to="/history" onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              isActive('/history') ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}>
            <span>📜</span> History
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-medium bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white transition-all">
            <span>🚪</span> Logout
          </button>
        </div>
      )}
    </nav>
  )
}