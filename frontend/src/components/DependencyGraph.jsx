import React from 'react';
import { CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';

export default function DependencyGraph({ scheme }) {
  const [allCheckedDocs, setAllCheckedDocs] = useStorage('gn_checked_docs', {});

  if (!scheme.docs) return null;

  const checkedDocs = allCheckedDocs[scheme.id] || {};

  const toggleDoc = (docId) => {
    setAllCheckedDocs(prev => ({
      ...prev,
      [scheme.id]: {
        ...(prev[scheme.id] || {}),
        [docId]: !(prev[scheme.id]?.[docId])
      }
    }));
  };

  const allDocs = [
    ...scheme.docs.foundational,
    ...scheme.docs.contextual,
    ...scheme.docs.instructional
  ];
  
  const completedCount = allDocs.filter(d => checkedDocs[d.doc_id]).length;
  const progressPercent = Math.round((completedCount / allDocs.length) * 100);

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
        
        <div style={{marginTop: '2rem', maxWidth: '400px', margin: '2rem auto 0'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem'}}>
            <span style={{color: 'var(--text-secondary)'}}>Application Readiness</span>
            <span style={{color: 'var(--accent-primary)', fontWeight: 700}}>{progressPercent}%</span>
          </div>
          <div style={{height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden'}}>
            <div style={{
              height: '100%', 
              width: `${progressPercent}%`, 
              background: 'var(--accent-primary)', 
              boxShadow: '0 0 10px var(--accent-primary)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
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
                <div 
                  key={doc.doc_id} 
                  onClick={() => toggleDoc(doc.doc_id)}
                  style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    padding: '1rem', 
                    background: checkedDocs[doc.doc_id] ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.03)', 
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: checkedDocs[doc.doc_id] ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {checkedDocs[doc.id] ? (
                    <CheckCircle2 size={18} color="var(--accent-primary)" />
                  ) : (
                    <Circle size={18} color="var(--text-secondary)" />
                  )}
                  <span style={{
                    color: checkedDocs[doc.id] ? '#fff' : '#e2e8f0', 
                    fontSize: '0.95rem',
                    textDecoration: checkedDocs[doc.id] ? 'line-through' : 'none',
                    opacity: checkedDocs[doc.id] ? 0.6 : 1
                  }}>
                    {doc.name}
                  </span>
                  {doc.mandatory && !checkedDocs[doc.id] && (
                    <span style={{fontSize: '0.65rem', color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700}}>Required</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{textAlign: 'center', marginTop: '4rem'}}>
        <a 
          href={scheme.sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary" 
          style={{
            padding: '1.2rem 3rem', 
            fontSize: '1.1rem', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            margin: '0 auto',
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
            textDecoration: 'none'
          }}
        >
          Begin Guided Application <ArrowRight size={20}/>
        </a>
        <p style={{marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
          We will redirect you to the official {scheme.department} portal.
        </p>
      </div>
    </div>
  );
}
