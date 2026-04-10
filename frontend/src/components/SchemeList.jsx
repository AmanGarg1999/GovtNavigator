import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function SchemeList({ schemes, onSelect }) {
  return (
    <div className="scheme-grid">
      {schemes.map(scheme => (
        <div key={scheme.id} className="glass-panel" style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{marginBottom: '1rem'}}>
            <span className={scheme.status === 'Eligible' ? 'badge badge-success' : 'badge badge-danger'}>
              {scheme.status}
            </span>
          </div>
          <h3 style={{marginBottom: '0.5rem'}}>{scheme.name}</h3>
          <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>
            {scheme.department}
          </p>
          
          <div style={{background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', flex: 1}}>
            <h4 style={{fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              {scheme.status === 'Eligible' ? <CheckCircle size={16} color="var(--success)"/> : <XCircle size={16} color="var(--danger)"/>}
              AI Analysis
            </h4>
            <p style={{fontSize: '0.9rem', lineHeight: '1.5', color: '#e2e8f0'}}>
              {scheme.logicMessage}
            </p>
          </div>

          <button 
            className="btn-primary" 
            style={{background: scheme.status === 'Eligible' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', color: scheme.status === 'Eligible' ? '#fff' : '#aaa'}}
            onClick={() => onSelect(scheme)}
            disabled={scheme.status !== 'Eligible'}
          >
            {scheme.status === 'Eligible' ? 'View Required Documents' : 'Cannot Proceed'}
          </button>
        </div>
      ))}
    </div>
  );
}
