import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are Canopy, a helpful assistant for www.gocanopy.com. Answer in a friendly, professional tone that matches Canopy\'s brand.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages })
    });
    const data = await res.json();
    setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        {/* Placeholder for Canopy logo */}
        <div style={{ width: 60, height: 60, background: '#1a73e8', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: 32, marginBottom: 8 }}>
          C
        </div>
        <h2 style={{ margin: 0, color: '#222', fontWeight: 700 }}>Canopy Chatbot</h2>
        <div style={{ color: '#888', fontSize: 16 }}>Ask me anything about Canopy!</div>
      </div>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 0, display: 'flex', flexDirection: 'column', minHeight: 480 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {messages.filter(m => m.role !== 'system').map((m, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 12
            }}>
              <div style={{
                background: m.role === 'user' ? '#1a73e8' : '#f1f3f4',
                color: m.role === 'user' ? '#fff' : '#222',
                borderRadius: 16,
                padding: '10px 16px',
                maxWidth: '75%',
                fontSize: 16,
                boxShadow: m.role === 'user' ? '0 2px 8px rgba(26,115,232,0.08)' : '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
              <div style={{ background: '#f1f3f4', color: '#222', borderRadius: 16, padding: '10px 16px', fontSize: 16 }}>
                Canopy is typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={sendMessage} style={{ display: 'flex', borderTop: '1px solid #eee', padding: 16, background: '#fafbfc', borderRadius: '0 0 16px 16px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #ccc',
              fontSize: 16,
              outline: 'none',
              marginRight: 8
            }}
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              background: '#1a73e8',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0 20px',
              fontSize: 16,
              fontWeight: 600,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              height: 44
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
} 