import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle, Filter, Search, Compass } from 'lucide-react';
import { ALL_STATES, ALL_SECTORS } from '../constants';

export default function SchemeList({ schemes, onSelect }) {
  const [stateFilter, setStateFilter] = useState('All');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      const matchState = stateFilter === 'All' || scheme.state === stateFilter || (stateFilter === 'Central' && scheme.state === 'Central');
      const matchSector = sectorFilter === 'All' || scheme.sector === sectorFilter || (scheme.tags && scheme.tags.includes(sectorFilter));
      const matchSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          scheme.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (scheme.tags && scheme.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchState && matchSector && matchSearch;
    });
  }, [schemes, stateFilter, sectorFilter, searchQuery]);

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      {/* Sidebar Filters */}
      <aside className="glass-panel" style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>
          <Filter size={20} />
          <h3 style={{ fontSize: '1.2rem' }}>Filters</h3>
        </div>

        <div className="form-group">
          <label>Search Schemes</label>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search..." 
              style={{ paddingLeft: '2.5rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>State / Category</label>
          <select 
            className="form-control" 
            value={stateFilter} 
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option value="All">All Regions</option>
            {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Sector / Industry</label>
          <select 
            className="form-control" 
            value={sectorFilter} 
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            <option value="All">All Sectors</option>
            {ALL_SECTORS.map(sec => <option key={sec} value={sec}>{sec}</option>)}
          </select>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Showing {filteredSchemes.length} of {schemes.length} available schemes.
          </p>
        </div>
      </aside>

      {/* Grid */}
      <div style={{ flex: 1 }}>
        {filteredSchemes.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
            <Compass size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-secondary)' }}>No schemes found matching your filters.</p>
            <button 
              className="btn-primary" 
              style={{ width: 'auto', marginTop: '1.5rem', padding: '0.5rem 2rem' }}
              onClick={() => { setStateFilter('All'); setSectorFilter('All'); setSearchQuery(''); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="scheme-grid" style={{ marginTop: 0 }}>
            {filteredSchemes.map(scheme => (
              <div key={scheme.id} className="glass-panel" style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                  <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                    <span className={scheme.status === 'Eligible' ? 'badge badge-success' : 'badge badge-danger'}>
                      {scheme.status}
                    </span>
                    {scheme.fitScore && (
                      <span className="badge" style={{
                        background: scheme.fitScore > 80 ? 'rgba(16, 185, 129, 0.1)' : scheme.fitScore > 50 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: scheme.fitScore > 80 ? 'var(--success)' : scheme.fitScore > 50 ? 'var(--warning)' : 'var(--danger)',
                        border: `1px solid ${scheme.fitScore > 80 ? 'var(--success)' : scheme.fitScore > 50 ? 'var(--warning)' : 'var(--danger)'}33`
                      }}>
                        {scheme.fitScore}% Match
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                    {scheme.state}
                  </span>
                </div>
                <h3 style={{marginBottom: '0.5rem', fontSize: '1.2rem'}}>{scheme.name}</h3>
                <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>
                  {scheme.department} • <span style={{color: 'var(--accent-primary)'}}>{scheme.sector}</span>
                </p>
                
                <div style={{background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', flex: 1}}>
                  <p style={{fontSize: '0.85rem', lineHeight: '1.5', color: '#e2e8f0', marginBottom: '0.5rem'}}>
                    {scheme.logicMessage}
                  </p>
                  {scheme.successStrategy && (
                    <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', marginTop: '0.5rem'}}>
                      <p style={{fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem'}}>
                        Strategy for Approval
                      </p>
                      <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic'}}>
                        "{scheme.successStrategy}"
                      </p>
                    </div>
                  )}
                </div>

                <div style={{display: 'flex', gap: '0.5rem', marginTop: 'auto'}}>
                  <button 
                    className="btn-primary" 
                    style={{
                      flex: 1,
                      background: scheme.status === 'Eligible' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', 
                      color: scheme.status === 'Eligible' ? '#fff' : 'var(--text-secondary)',
                      border: scheme.status === 'Eligible' ? 'none' : '1px solid var(--card-border)'
                    }}
                    onClick={() => onSelect(scheme)}
                    disabled={scheme.status !== 'Eligible'}
                  >
                    {scheme.status === 'Eligible' ? 'Check Documents' : 'Not Eligible'}
                  </button>
                  {scheme.sourceUrl && (
                    <a 
                      href={scheme.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{
                        padding: '0 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '8px',
                        color: 'var(--text-secondary)'
                      }}
                      title="Visit Official Portal"
                    >
                      <Compass size={18} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
