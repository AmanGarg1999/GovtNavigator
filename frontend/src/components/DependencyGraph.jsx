import React from 'react';
import { CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';

export default function DependencyGraph({ scheme }) {
  if (!scheme.docs) return null;

  // Flatten the documents into a linear path
  const roadmapSteps = [
    { title: "Foundational Identity", docs: scheme.docs.foundational, time: "1-3 Days" },
    { title: "Scheme Specific Proofs", docs: scheme.docs.contextual, time: "5-10 Days" },
    { title: "Final Compliance & Formatting", docs: scheme.docs.instructional, time: "1 Day" }
  ];

  return (
    <div className="glass-panel" style={{maxWidth: '800px', margin: '0 auto', padding: '3rem'}}>
      <div style={{textAlign: 'center', marginBottom: '3rem'}}>
        <h2 style={{fontSize: '2rem', marginBottom: '0.5rem'}}>{scheme.name}</h2>
        <p style={{color: 'var(--accent-primary)', fontWeight: 600}}>Your Actionable Application Roadmap</p>
      </div>

      <div style={{position: 'relative'}}>
        {/* The vertical line */}
        <div style={{
          position: 'absolute', 
          left: '1.5rem', 
          top: '0', 
          bottom: '0', 
          width: '2px', 
          background: 'linear-gradient(to bottom, var(--accent-primary), transparent)',
          zIndex: 0
        }} />

        {roadmapSteps.map((step, idx) => (
          <div key={idx} style={{position: 'relative', paddingLeft: '4rem', marginBottom: '3rem', zIndex: 1}}>
            <div style={{
              position: 'absolute', 
              left: '0', 
              top: '0', 
              width: '3rem', 
              height: '3rem', 
              background: 'var(--bg-gradient)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '2px solid var(--accent-primary)',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
            }}>
              <span style={{fontWeight: 700}}>{idx + 1}</span>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <h3 style={{fontSize: '1.3rem'}}>{step.title}</h3>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem'}}>
                <Clock size={14}/>
                <span>Est: {step.time}</span>
              </div>
            </div>

            <div style={{display: 'grid', gap: '0.75rem'}}>
              {step.docs.map(doc => (
                <div key={doc.id} style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1rem', 
                  background: 'rgba(255,255,255,0.03)', 
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <Circle size={18} color="var(--text-secondary)" />
                  <span style={{color: '#e2e8f0', fontSize: '0.95rem'}}>{doc.name}</span>
                  {doc.mandatory && <span style={{fontSize: '0.65rem', color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700}}>Required</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{textAlign: 'center', marginTop: '4rem'}}>
        <button className="btn-primary" style={{
          padding: '1.2rem 3rem', 
          fontSize: '1.1rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          margin: '0 auto',
          boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
        }}>
          Begin Guided Application <ArrowRight size={20}/>
        </button>
        <p style={{marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
          We will redirect you to the official {scheme.department} portal.
        </p>
      </div>
    </div>
  );
}
