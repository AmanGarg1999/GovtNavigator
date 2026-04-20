import React, { useState, useRef, useEffect } from 'react';

const Consultant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your AI Bureaucracy Consultant. I can help you find official procedures for any government paperwork, licenses, or schemes. What would you like to do today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [thought, setThought] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thought]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setThought('Analyzing your request...');

    try {
      const response = await fetch('http://localhost:8000/api/v1/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages.slice(-5) // Send last 5 for context
        }),
      });

      const data = await response.json();
      
      if (data.thought) {
        setThought(data.thought);
        // Small delay to simulate "thinking" for UX
        await new Promise(r => setTimeout(r, 1500));
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }]);
      setThought(null);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error connecting to the search engine. Please try again.' 
      }]);
    } finally {
      setLoading(false);
      setThought(null);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>AI Bureaucracy Consultant</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Powered by live search and Indian Government Gazettes
        </p>
      </div>

      <div className="glass-panel chat-container">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`message message-${m.role}`}>
              {m.content.split('\n').map((line, li) => (
                <p key={li} style={{ margin: '0.25rem 0' }}>{line}</p>
              ))}
            </div>
          ))}
          
          {thought && (
            <div className="thought-process" style={{ opacity: loading ? 0.7 : 1 }}>
              <div className="thought-header" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>
                {loading ? 'Consultant Thinking...' : 'Search Reasoning'}
              </div>
              {thought.split('\n').map((line, li) => (
                <p key={li} style={{ margin: '0.1rem 0' }}>{line}</p>
              ))}
            </div>
          )}
          
          {loading && !thought && (
            <div className="thought-process animate-pulse">
              Consultant is accessing government databases...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            className="form-control"
            placeholder="e.g., How do I get a shop license in Bangalore?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button 
            className="btn-primary" 
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Consultant;
