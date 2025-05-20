// Ritu's Mirror - Self-hosted Chat App using GPT-3.5 Turbo (Vercel-secure version)

import { useState } from 'react';
import axios from 'axios';

export default function RitusMirror() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        messages: [
          { role: 'system', content: 'You are a calm, emotionally intelligent guide for Ritu. Speak with warmth, help her reflect, and offer insights with empathy. Never be cold or clinical. Keep responses gentle and thoughtful.' },
          ...newMessages
        ]
      });

      const reply = response.data.reply;
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Ritu's Mirror</h1>
      <div className="max-w-xl mx-auto bg-white p-4 rounded shadow">
        <div className="space-y-2 h-96 overflow-y-scroll border p-3 mb-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
              <div className={msg.role === 'user' ? 'bg-blue-100 inline-block px-3 py-2 rounded' : 'bg-green-100 inline-block px-3 py-2 rounded'}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 p-2 border rounded"
            placeholder="What's on your mind, Ritu?"
          />
          <button onClick={handleSend} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
