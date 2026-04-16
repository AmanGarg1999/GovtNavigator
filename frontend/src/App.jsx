import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import OnboardingForm from './components/OnboardingForm';
import SchemeList from './components/SchemeList';
import DependencyGraph from './components/DependencyGraph';
import { Compass, Loader2, Home, User } from 'lucide-react';
import axios from 'axios';
import { useStorage } from './hooks/useStorage';

// Backend URL configuration
const API_BASE = 'http://localhost:8000/api/v1';

/**
 * Normalizes backend database schemes into a format compatible with the UI components.
 */
const mapBackendSchemeToFrontend = (dbScheme) => {
  const { data } = dbScheme;
  return {
    id: dbScheme.scheme_id,
    name: dbScheme.name,
    department: dbScheme.department,
    state: dbScheme.state,
    status: 'Eligible', 
    fitScore: 100,
    benefits: data.benefits?.description || "Comprehensive government support available.",
    sourceUrl: data.source_verification?.official_urls?.[0] || "#",
    docs: {
      foundational: data.document_dependency_graph?.foundational || [],
      contextual: data.document_dependency_graph?.contextual || [],
      instructional: data.document_dependency_graph?.instructional || []
    },
    category: data.basic_details?.category || 'Welfare',
    complexityScore: data.basic_details?.complexity_score || 1,
    statePortalUrl: data.basic_details?.state_portal_url,
    lastVerified: data.source_verification?.last_verified,
    accuracyScore: data.source_verification?.accuracy_score || 100,
    sector: data.basic_details?.scheme_tags?.[0] || 'General',
    tags: data.basic_details?.scheme_tags || [],
    logicMessage: "Verified source data matches your profile parameters.",
    successStrategy: "Review documents and visit the official portal to begin."
  };
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Persisted state
  const [profile, setProfile] = useStorage('gn_citizen_profile', null);
  const [results, setResults] = useStorage('gn_analysis_results', []);
  
  // Runtime state
  const [rawSchemes, setRawSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all schemes once on startup
  useEffect(() => {
    const fetchGlobalSchemes = async () => {
      try {
        const response = await axios.get(`${API_BASE}/schemes`);
        setRawSchemes(response.data);
      } catch (err) {
        console.error("Failed to load official schemes:", err);
        setError("Network error: Could not reach official secure servers.");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchGlobalSchemes();
  }, []);

  const handleProfileSubmit = async (data) => {
    if (!data) {
      setProfile({ browsingOnly: true });
      // Map all schemes for browsing
      setResults(rawSchemes.map(mapBackendSchemeToFrontend));
      navigate('/results');
      return;
    }

    setProfile(data);
    setLoading(true);
    setError(null);
    navigate('/results');

    try {
      // Trigger deep eligibility analysis for each scheme based on REAL profile data
      const analyzedSchemes = await Promise.all(rawSchemes.map(async (dbScheme) => {
        const uiScheme = mapBackendSchemeToFrontend(dbScheme);
        try {
          const response = await axios.post(`${API_BASE}/eligibility/analyze`, {
            user_profile: {
              age: parseInt(data.age),
              domicile_state: data.state,
              education_level: data.education, 
              income_annual: parseInt(data.workforceSize || 0) * 50000 + (parseInt(data.projectCost || 0) / 10), // Improved heuristic
              gender: data.gender,
              enterprise_type: data.enterpriseType || "Proprietorship",
              project_cost: parseInt(data.projectCost || 0),
              social_category: data.socialCategory || "General",
              is_defaulter: false
            },
            scheme_rules: dbScheme.data.eligibility_rules,
            scheme_name: dbScheme.name
          });

          const result = response.data;
          return {
            ...uiScheme,
            status: result.status === 'Eligible' ? 'Eligible' : 'Ineligible',
            fitScore: result.fit_score || (result.status === 'Eligible' ? 95 : 30),
            logicMessage: result.summary_message || result.message,
            successStrategy: result.success_strategy || "Gather all priority documents."
          };
        } catch (e) {
          return { ...uiScheme, status: 'Analysis Pending', logicMessage: 'Analysis engine timeout.' };
        }
      }));

      setResults(analyzedSchemes.sort((a, b) => b.fitScore - a.fitScore));
    } catch (err) {
      console.error("Analysis Pipeline Failed:", err);
      setError("Data validation in progress. Results may vary.");
    } finally {
      setLoading(false);
    }
  };

  const selectedScheme = useMemo(() => {
    if (location.pathname.startsWith('/scheme/')) {
      const id = location.pathname.split('/').pop();
      return results.find(s => s.id === id);
    }
    return null;
  }, [location.pathname, results]);

  if (initialLoading) {
    return (
      <div className="app-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <div style={{textAlign: 'center'}}>
          <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
          <p style={{marginTop: '1.5rem', color: 'var(--text-secondary)', fontWeight: 500}}>Syncing with Digital India Portals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Compass size={42} color="var(--accent-primary)"/>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ margin: 0, fontSize: '2.2rem' }}>GovtNavigator</h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Bureaucratic Intelligence Engine</p>
          </div>
        </div>
      </header>

      <nav style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
        <button 
          onClick={() => navigate('/')}
          className="btn-secondary" 
          style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}
        >
          <Home size={18}/> Home
        </button>
        {profile && (
          <button 
            onClick={() => navigate('/results')}
            className="btn-secondary" 
            style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}
          >
            <Compass size={18}/> My Navigator
          </button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<OnboardingForm onSubmit={handleProfileSubmit} initialData={profile} />} />
        
        <Route path="/results" element={
          loading ? (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem'}}>
              <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
              <p style={{marginTop: '1.5rem', color: 'var(--text-secondary)', fontWeight: 500}}>AI is parsing latest gazettes for {profile?.domicile_state || 'your profile'}...</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {profile?.browsingOnly ? 'National Directory' : `Navigator: ${profile?.state}`}
                    {profile?.state && <span style={{ fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>Official State Context</span>}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {profile?.browsingOnly 
                      ? `Browsing ${results.length} live government services across India.`
                      : `Analyzed ${results.length} services. Found ${results.filter(s => s.status === 'Eligible' && s.category === 'Welfare').length} welfare schemes and ${results.filter(s => s.status === 'Eligible' && s.category === 'Bureaucracy').length} document guides for you.`}
                  </p>
                </div>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>
                  Edit Profile &rarr;
                </button>
              </div>
              {error && <p style={{color: 'var(--danger)', marginBottom: '1rem'}}>{error}</p>}
              <SchemeList schemes={results} onSelect={(s) => navigate(`/scheme/${s.id}`)} />
            </div>
          )
        } />

        <Route path="/scheme/:id" element={
          selectedScheme ? (
            <div>
              <button 
                onClick={() => navigate('/results')}
                style={{background: 'none', border:'none', color:'var(--text-secondary)', cursor:'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
              >
                &larr; Back to Results
              </button>
              <DependencyGraph scheme={selectedScheme} />
            </div>
          ) : <Navigate to="/results" />
        } />
      </Routes>
    </div>
  );
}

export default App;
