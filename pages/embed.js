import { useState, useRef, useEffect } from 'react';

export default function Embed() {
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
    <div style={{ 
      height: '100vh', 
      background: '#fff', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: 16,
        background: '#f8f9fa'
      }}>
        {messages.filter(m => m.role !== 'system').map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: 12
          }}>
            <div style={{
              background: m.role === 'user' ? '#1a73e8' : '#fff',
              color: m.role === 'user' ? '#fff' : '#333',
              borderRadius: 18,
              padding: '12px 16px',
              maxWidth: '80%',
              fontSize: 14,
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              border: m.role === 'assistant' ? '1px solid #e1e5e9' : 'none'
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
            <div style={{ 
              background: '#fff', 
              color: '#666', 
              borderRadius: 18, 
              padding: '12px 16px', 
              fontSize: 14,
              border: '1px solid #e1e5e9'
            }}>
              Canopy is typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ 
        padding: 16, 
        background: '#fff', 
        borderTop: '1px solid #e1e5e9',
        display: 'flex',
        gap: 8
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Canopy anything..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 24,
            border: '1px solid #e1e5e9',
            fontSize: 14,
            outline: 'none',
            background: '#f8f9fa'
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            background: '#1a73e8',
            color: '#fff',
            border: 'none',
            borderRadius: 24,
            padding: '12px 20px',
            fontSize: 14,
            fontWeight: 500,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            minWidth: 60
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
} 