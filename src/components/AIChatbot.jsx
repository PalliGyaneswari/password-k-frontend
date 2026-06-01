import { useState } from 'react'
import API from '../api/axios'

export default function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I\'m your Password K security assistant. Ask me anything about password security! 🔐' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)
    try {
      const res = await API.post('/ai/chat', { message: userMsg })
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I had trouble responding. Try again!' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-purple-900 px-4 py-3 flex justify-between items-center">
            <span className="text-white text-sm font-semibold">🤖 Security Assistant</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-lg">×</button>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-72">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`text-xs px-3 py-2 rounded-xl max-w-xs ${
                  m.role === 'user'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gray-800 text-gray-300'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-400 text-xs px-3 py-2 rounded-xl">🤖 Thinking...</div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-gray-800 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about password security..."
              className="flex-1 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-purple-500 border border-gray-700"
            />
            <button onClick={sendMessage}
              className="bg-purple-700 hover:bg-purple-600 text-white text-xs px-3 py-2 rounded-lg">
              Send
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)}
        className="bg-purple-700 hover:bg-purple-600 text-white w-14 h-14 rounded-full shadow-lg text-2xl flex items-center justify-center">
        🤖
      </button>
    </div>
  )
}