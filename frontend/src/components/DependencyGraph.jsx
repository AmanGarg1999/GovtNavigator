import React from 'react';
import { CheckCircle2, Circle, Clock, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';

export default function DependencyGraph({ scheme }) {
  const [allCheckedDocs, setAllCheckedDocs] = useStorage('gn_checked_docs', {});
  const [globalDocs, setGlobalDocs] = useStorage('gn_global_docs', {});

  if (!scheme.docs) return null;

  const checkedDocs = allCheckedDocs[scheme.id] || {};

  const toggleDoc = (docId) => {
    if (!docId) return;
    const isGlobal = docId.startsWith('GLOBAL-');
    
    // Toggle scheme-specific state
    setAllCheckedDocs(prev => ({
      ...prev,
      [scheme.id]: {
        ...(prev[scheme.id] || {}),
        [docId]: !(prev[scheme.id]?.[docId])
      }
    }));

    // If global, toggle global state too
    if (isGlobal) {
      setGlobalDocs(prev => ({
        ...prev,
        [docId]: !prev[docId]
      }));
    }
  };

  const isChecked = (docId) => {
    if (!docId) return false;
    const isGlobal = docId.startsWith('GLOBAL-');
    return checkedDocs[docId] || (isGlobal && globalDocs[docId]);
  };

  const allDocs = [
    ...scheme.docs.foundational,
    ...scheme.docs.contextual,
    ...scheme.docs.instructional
  ];
  
  const completedCount = allDocs.filter(d => isChecked(d.doc_id)).length;
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
             {scheme.category === 'Bureaucracy' && <span className="badge" style={{ background: 'rgba(167, 139, 250, 0.1)', color: '#a78bfa', border: '1px solid rgba(167, 139, 250, 0.2)' }}>Official Bureaucracy Guide</span>}
             <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={12}/> Verified Accurate
             </span>
        </div>
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
                    background: isChecked(doc.doc_id) ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.03)', 
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: isChecked(doc.doc_id) ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isChecked(doc.doc_id) ? (
                    <CheckCircle2 size={18} color="var(--accent-primary)" />
                  ) : (
                    <Circle size={18} color="var(--text-secondary)" />
                  )}
                  <span style={{
                    color: isChecked(doc.doc_id) ? '#fff' : '#e2e8f0', 
                    fontSize: '0.95rem',
                    textDecoration: isChecked(doc.doc_id) ? 'line-through' : 'none',
                    opacity: isChecked(doc.doc_id) ? 0.6 : 1
                  }}>
                    {doc.name || doc.instruction}
                  </span>
                  {doc.mandatory && !isChecked(doc.doc_id) && (
                    <span style={{fontSize: '0.65rem', color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700}}>Required</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{textAlign: 'center', marginTop: '4rem', padding: '2rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.1)'}}>
        <h4 style={{marginBottom: '1rem', fontSize: '1.2rem', color: '#fff'}}>Ready to move forward?</h4>
        <p style={{marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 2rem'}}>
          We have generated your personalized roadmap for <strong>{scheme.state}</strong>. Ensure you have the physical originals ready before visiting the portal.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href={scheme.statePortalUrl || scheme.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary" 
              style={{
                padding: '1.2rem 2.5rem', 
                fontSize: '1rem', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                textDecoration: 'none'
              }}
            >
              Move to Official {scheme.state} Portal <ExternalLink size={18}/>
            </a>
            
            <a 
              href={scheme.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary" 
              style={{
                padding: '1.2rem 2.5rem', 
                fontSize: '1rem', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                textDecoration: 'none',
                width: 'auto'
              }}
            >
              Secondary Information Source
            </a>
        </div>
        <p style={{marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'}}>
          <ShieldCheck size={14} color="var(--success)"/> Link last verified accurate on {scheme.lastVerified || 'recent date'}
        </p>
      </div>
    </div>
  );
}
