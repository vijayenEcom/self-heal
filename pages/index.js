// self-heal - Self-hosted Chat App using GPT-3.5 Turbo (Vercel-secure version)

import { useState } from 'react';
import axios from 'axios';

export default function SelfHeal() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome. This space is here for you.' }
  ]);
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
          { role: 'system', content: 'You are a calm, emotionally intelligent guide. Speak with warmth, help the user reflect, and offer insights with empathy. Never be cold or clinical. Keep responses gentle and thoughtful.' },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-indigo-800">Welcome to Self-Heal</h1>
      <p className="text-center text-gray-600 mb-6">What's on your mind today?</p>
      <div className="max-w-xl mx-auto bg-white p-4 rounded-2xl shadow-lg">
        <div className="space-y-2 h-96 overflow-y-scroll border p-3 mb-4 rounded-md bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
              <div className={msg.role === 'user' ? 'bg-blue-100 inline-block px-3 py-2 rounded-lg' : 'bg-green-100 inline-block px-3 py-2 rounded-lg'}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            rows={3}
            className="flex-1 p-2 border rounded resize-none"
            placeholder="Type your thoughts here..."
          />
          <button onClick={handleSend} disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
