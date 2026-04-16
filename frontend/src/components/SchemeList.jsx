import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle, Filter, Search, Compass, Gift, FileText, BadgeCheck, ExternalLink } from 'lucide-react';
import { ALL_STATES, ALL_SECTORS } from '../constants';

export default function SchemeList({ schemes, onSelect }) {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      const matchCategory = categoryFilter === 'All' || scheme.category === categoryFilter;
      const matchState = stateFilter === 'All' || scheme.state === stateFilter || (stateFilter === 'Central' && (scheme.state === 'Central' || scheme.state === 'All'));
      const matchSector = sectorFilter === 'All' || scheme.sector === sectorFilter || (scheme.tags && scheme.tags.includes(sectorFilter));
      const matchSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          scheme.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (scheme.tags && scheme.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCategory && matchState && matchSector && matchSearch;
    });
  }, [schemes, categoryFilter, stateFilter, sectorFilter, searchQuery]);

  const stats = useMemo(() => {
    const welfare = schemes.filter(s => s.category === 'Welfare').length;
    const bureaucracy = schemes.filter(s => s.category === 'Bureaucracy').length;
    return { welfare, bureaucracy };
  }, [schemes]);

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      {/* Sidebar Filters */}
      <aside className="glass-panel" style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>
          <Filter size={20} />
          <h3 style={{ fontSize: '1.2rem' }}>Filters</h3>
        </div>

        <div className="form-group">
          <label>Service Category</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
            <button 
              onClick={() => setCategoryFilter('All')}
              className={categoryFilter === 'All' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.5rem', fontSize: '0.85rem' }}
            >
              All Services ({schemes.length})
            </button>
            <button 
              onClick={() => setCategoryFilter('Welfare')}
              className={categoryFilter === 'Welfare' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Gift size={14}/> Welfare ({stats.welfare})
            </button>
            <button 
              onClick={() => setCategoryFilter('Bureaucracy')}
              className={categoryFilter === 'Bureaucracy' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <FileText size={14}/> Guides ({stats.bureaucracy})
            </button>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label>Search Directory</label>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Scheme or document..." 
              style={{ paddingLeft: '2.5rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Regional Jurisdiction</label>
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
          <label>Sector / Domain</label>
          <select 
            className="form-control" 
            value={sectorFilter} 
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            <option value="All">All Sectors</option>
            {ALL_SECTORS.map(sec => <option key={sec} value={sec}>{sec}</option>)}
          </select>
        </div>
      </aside>

      {/* Grid */}
      <div style={{ flex: 1 }}>
        {filteredSchemes.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
            <Compass size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-secondary)' }}>No results found matching your filters.</p>
            <button 
              className="btn-primary" 
              style={{ width: 'auto', marginTop: '1.5rem', padding: '0.5rem 2rem' }}
              onClick={() => { setStateFilter('All'); setSectorFilter('All'); setSearchQuery(''); setCategoryFilter('All'); }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="scheme-grid" style={{ marginTop: 0 }}>
            {filteredSchemes.map(scheme => {
              const isBureaucracy = scheme.category === 'Bureaucracy';
              const accentColor = isBureaucracy ? '#a78bfa' : 'var(--accent-primary)'; // Purple for Bureaucracy
              
              return (
                <div key={scheme.id} className="glass-panel" style={{
                  display: 'flex', 
                  flexDirection: 'column',
                  borderTop: `4px solid ${accentColor}`,
                  boxShadow: isBureaucracy ? '0 10px 30px rgba(167, 139, 250, 0.1)' : 'none'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                    <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap'}}>
                      <span className="badge" style={{
                        background: isBureaucracy ? 'rgba(167, 139, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: accentColor,
                        border: `1px solid ${accentColor}33`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        {isBureaucracy ? <FileText size={12}/> : <Gift size={12}/>}
                        {scheme.category === 'Bureaucracy' ? 'Document Guide' : 'Welfare Scheme'}
                      </span>
                      
                      <span className={scheme.status === 'Eligible' ? 'badge badge-success' : 'badge badge-danger'}>
                        {scheme.status}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                      {scheme.state}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', lineHeight: '1.3' }}>{scheme.name}</h3>
                  </div>

                  <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>
                    {scheme.department} {scheme.sector && `• `} <span style={{color: accentColor}}>{scheme.sector}</span>
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${(scheme.complexityScore / 10) * 100}%`, 
                        background: scheme.complexityScore > 7 ? 'var(--danger)' : scheme.complexityScore > 4 ? '#fbbf24' : '#10b981'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Effort: {scheme.complexityScore}/10
                    </span>
                  </div>
                  
                  <div style={{
                    background: isBureaucracy ? 'rgba(167, 139, 250, 0.05)' : 'rgba(0,0,0,0.2)', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    marginBottom: '1rem', 
                    flex: 1,
                    border: isBureaucracy ? '1px solid rgba(167, 139, 250, 0.1)' : 'none'
                  }}>
                    <p style={{fontSize: '0.85rem', lineHeight: '1.5', color: '#e2e8f0', marginBottom: '0.5rem'}}>
                      {scheme.logicMessage}
                    </p>
                    {scheme.successStrategy && (
                      <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', marginTop: '0.5rem'}}>
                        <p style={{fontSize: '0.75rem', color: accentColor, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem'}}>
                          Roadmap Strategy
                        </p>
                        <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic'}}>
                          "{scheme.successStrategy}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div style={{display: 'flex', gap: '0.5rem', marginTop: 'auto', flexDirection: 'column'}}>
                    {scheme.lastVerified && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', padding: '4px 8px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                        <BadgeCheck size={14} color="var(--success)" />
                        <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 600 }}>
                          Verified Accurate: {scheme.lastVerified}
                        </span>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn-primary" 
                        style={{
                          flex: 1,
                          background: scheme.status === 'Eligible' ? accentColor : 'rgba(255,255,255,0.05)', 
                          color: scheme.status === 'Eligible' ? '#000' : 'var(--text-secondary)',
                          fontWeight: 700,
                          border: 'none'
                        }}
                        onClick={() => onSelect(scheme)}
                        disabled={scheme.status !== 'Eligible'}
                      >
                        {scheme.status === 'Eligible' ? (isBureaucracy ? 'Get Navigator' : 'Check Documents') : 'Not Eligible'}
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
                        <ExternalLink size={18} />
                      </a>
                    )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
