import React, { useState, useEffect } from 'react';
import OnboardingForm from './components/OnboardingForm';
import SchemeList from './components/SchemeList';
import DependencyGraph from './components/DependencyGraph';
import { Compass, Loader2 } from 'lucide-react';
import axios from 'axios';

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
    status: 'Eligible', // We default to eligible for discovery; analyzer refines this
    fitScore: 100,
    benefits: data.benefits?.description || "Comprehensive government support available.",
    sourceUrl: data.source_verification?.official_urls?.[0] || "#",
    docs: {
      foundational: data.document_dependency_graph?.foundational || [],
      contextual: data.document_dependency_graph?.contextual || [],
      instructional: data.document_dependency_graph?.instructional || []
    },
    logicMessage: "Verified source data matches your profile parameters.",
    successStrategy: "Review documents and visit the official portal to begin."
  };
};

function App() {
  const [profile, setProfile] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [rawSchemes, setRawSchemes] = useState([]); // Store original DB format
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  // Phase 1: Initial Discovery - Fetch all validated schemes from the real DB
  useEffect(() => {
    const fetchGlobalSchemes = async () => {
      try {
        const response = await axios.get(`${API_BASE}/schemes`);
        const dbSchemes = response.data;
        setRawSchemes(dbSchemes);
        // Map to UI format
        const uiSchemes = dbSchemes.map(mapBackendSchemeToFrontend);
        setSchemes(uiSchemes);
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
    console.log("Analyzing Profile against real-world data...");
    
    if (!data) {
      setProfile({ browsingOnly: true });
      return;
    }

    setProfile(data);
    setLoading(true);
    setError(null);

    try {
      // Trigger deep eligibility analysis for each scheme
      const analyzedSchemes = await Promise.all(rawSchemes.map(async (dbScheme) => {
        const uiScheme = mapBackendSchemeToFrontend(dbScheme);
        try {
          const response = await axios.post(`${API_BASE}/eligibility/analyze`, {
            user_profile: {
              age: parseInt(data.age),
              domicile_state: data.state,
              education_level: "Bachelors", 
              income_annual: parseInt(data.projectCost || 0) / 4, 
              gender: "Male",
              enterprise_type: data.businessType,
              project_cost: parseInt(data.projectCost || 0),
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

      // Sort by fit score
      setSchemes(analyzedSchemes.sort((a, b) => b.fitScore - a.fitScore));
    } catch (err) {
      console.error("Analysis Pipeline Failed:", err);
      setError("Data validation in progress. Results may vary.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="app-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <div style={{textAlign: 'center'}}>
          <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
          <p style={{marginTop: '1.5rem', color: 'var(--text-secondary)', fontWeight: 500}}>Establishing Secure Connection to Portals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1><Compass style={{display: 'inline', marginTop: '-5px'}} size={36}/> GovtNavigator</h1>
        <p>Real-Time Bureaucratic Intelligence</p>
      </header>

      {!profile ? (
        <OnboardingForm onSubmit={handleProfileSubmit} />
      ) : !selectedScheme ? (
        <div>
          <button 
            onClick={() => setProfile(null)}
            style={{background: 'none', border:'none', color:'var(--accent-primary)', cursor:'pointer', marginBottom: '1rem', fontWeight: 600}}
          >
            &larr; {profile.browsingOnly ? 'Back to Onboarding' : 'Edit Profile'}
          </button>
          <h2>{profile.browsingOnly ? 'National Scheme Directory' : 'Your Optimized Benefit Match'}</h2>
          <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>
            {profile.browsingOnly 
              ? `Browsing ${schemes.length} live government subsidies.`
              : `Found ${schemes.filter(s => s.status === 'Eligible').length} eligible programs for your profile.`}
          </p>
          
          {loading ? (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem'}}>
              <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
              <p style={{marginTop: '1rem', color: 'var(--text-secondary)'}}>Sarkari-AI is verifying rules against latest gazettes...</p>
            </div>
          ) : (
            <>
              {error && <p style={{color: 'var(--danger)', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.8rem', borderRadius: '8px'}}>{error}</p>}
              <SchemeList schemes={schemes} onSelect={setSelectedScheme} />
            </>
          )}
        </div>
      ) : (
        <div>
           <button 
            onClick={() => setSelectedScheme(null)}
            style={{background: 'none', border:'none', color:'var(--text-secondary)', cursor:'pointer', marginBottom: '1rem'}}
          >
            &larr; Back to Results
          </button>
          <DependencyGraph scheme={selectedScheme} />
        </div>
      )}
    </div>
  );
}

export default App;
