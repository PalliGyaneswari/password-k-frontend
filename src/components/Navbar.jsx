import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-950 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
      <Link to="/transform" className="text-white font-bold text-xl tracking-wide">
        🔐 Password <span className="text-emerald-400">K</span>
      </Link>
      <div className="flex gap-6 items-center">
        {user ? (
          <>
            <Link to="/transform" className="text-gray-300 hover:text-white text-sm">Transform</Link>
            <Link to="/history" className="text-gray-300 hover:text-white text-sm">History</Link>
            <span className="text-emerald-400 text-sm">Hi, {user.username}</span>
            <button onClick={handleLogout}
              className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white text-sm">Login</Link>
            <Link to="/register"
              className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}