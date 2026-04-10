import React from 'react';
import { Layers, FileText, AlertCircle } from 'lucide-react';

export default function DependencyGraph({ scheme }) {
  if (!scheme.docs) return null;

  return (
    <div className="glass-panel" style={{maxWidth: '800px', margin: '0 auto'}}>
      <h2 style={{marginBottom: '0.5rem'}}>{scheme.name}</h2>
      <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>Document Dependency Checklist</p>

      <div className="checklist-group">
        <h4><Layers size={20}/> Foundational Documents</h4>
        <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>Standard identity proofs required across all portals.</p>
        {scheme.docs.foundational.map(doc => (
          <div className="checklist-item" key={doc.id}>
            <input type="checkbox" className="checkbox" />
            <div>
              <p style={{fontWeight: '500'}}>{doc.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="checklist-group">
        <h4><FileText size={20}/> Contextual Documents</h4>
        <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>Specific proofs required for this particular scheme.</p>
        {scheme.docs.contextual.map(doc => (
          <div className="checklist-item" key={doc.id}>
            <input type="checkbox" className="checkbox" />
            <div>
              <p style={{fontWeight: '500'}}>{doc.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="checklist-group">
        <h4><AlertCircle size={20}/> Instructional / Actionable</h4>
        <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>Specific formatting rules defined by the gazette.</p>
        {scheme.docs.instructional.map(doc => (
          <div className="checklist-item" key={doc.id}>
            <input type="checkbox" className="checkbox" />
            <div>
              <p style={{fontWeight: '500'}}>{doc.name}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="btn-primary" style={{marginTop: '1rem'}}>Mark as Ready & Continue to Govt Portal</button>
    </div>
  );
}
