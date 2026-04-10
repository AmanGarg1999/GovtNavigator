import React, { useState } from 'react';
import OnboardingForm from './components/OnboardingForm';
import SchemeList from './components/SchemeList';
import DependencyGraph from './components/DependencyGraph';
import { FileText, Compass, Loader2 } from 'lucide-react';
import axios from 'axios';

// Hardcoded Mock State for Sprint 3 MVP Development
const MOCK_SCHEMES = [
  {
    id: "UP-MSME-01",
    name: "Mukhyamantri Yuva Swarozgar Yojana (MYSY)",
    department: "MSME, Uttar Pradesh",
    status: "Eligible",
    benefits: "Margin money subsidy of 25% of the project cost.",
    logicMessage: "You passed all logical requirements. You meet the age (<40) and state domicile requirements.",
    docs: {
      foundational: [
        { id: "AADHAAR", name: "Aadhaar Card", mandatory: true },
        { id: "PAN", name: "PAN Card", mandatory: true }
      ],
      contextual: [
        { id: "DOMICILE", name: "UP Domicile Certificate", mandatory: true },
        { id: "DPR", name: "Detailed Project Report", mandatory: true }
      ],
      instructional: [
        { id: "AFF_10", name: "Affidavit on Rs. 10 Stamp Paper declaring no default", mandatory: true }
      ]
    }
  },
  {
    id: "CG-MSME-02",
    name: "CGTMSE Guarantee Scheme",
    department: "Ministry of MSME, Central",
    status: "Ineligible",
    benefits: "Collateral-free loan up to Rs. 2 Crore.",
    logicMessage: "Your project cost (Rs. 2.5 Crore) exceeds the maximum allowed limit for this collateral-free scheme (Rs. 2 Crore). As a fixable gap, consider reducing your proposed loan amount or submitting partial collateral.",
    docs: null
  }
];

function App() {
  const [profile, setProfile] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleProfileSubmit = async (data) => {
    console.log("Profile Submitted:", data);
    setProfile(data);
    setLoading(true);
    setError(null);

    // Hardcoded rules for the demo scheme (MYSY UP)
    const demoSchemeRules = {
      "age_check_max": { "<=": [{"var": "age"}, 40] },
      "age_check_min": { ">=": [{"var": "age"}, 18] },
      "domicile_check": { "==": [{"var": "domicile_state"}, "Uttar Pradesh"] },
      "defaulter_check": { "==": [{"var": "is_defaulter"}, false] },
      "enterprise_type_check": { "in": [{"var": "enterprise_type"}, ["Manufacturing", "Service"]] }
    };

    try {
      // The /api/ prefix is handled by Nginx proxy in Docker, or use absolute URL for local dev
      const response = await axios.post('/api/v1/eligibility/analyze', {
        user_profile: {
          age: parseInt(data.age),
          domicile_state: data.state,
          education_level: "Bachelors", // default for demo
          income_annual: parseInt(data.projectCost) / 5, // mock income
          gender: "Male",
          enterprise_type: data.businessType,
          project_cost: parseInt(data.projectCost),
          is_defaulter: false
        },
        scheme_rules: demoSchemeRules,
        scheme_name: "Mukhyamantri Yuva Swarozgar Yojana (MYSY)"
      });

      // Format the response for our UI
      const result = response.data;
      const formattedScheme = {
        id: "UP-MSME-01",
        name: "Mukhyamantri Yuva Swarozgar Yojana (MYSY)",
        department: "MSME, Uttar Pradesh",
        status: result.status === 'Eligible' ? 'Eligible' : 'Ineligible',
        benefits: "Margin money subsidy of 25% of the project cost.",
        logicMessage: result.summary_message || result.message,
        docs: result.status === 'Eligible' ? MOCK_SCHEMES[0].docs : null
      };

      setSchemes([formattedScheme, ...MOCK_SCHEMES.slice(1)]);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to connect to the analysis engine. Showing cached data.");
      setSchemes(MOCK_SCHEMES);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1><Compass style={{display: 'inline', marginTop: '-5px'}} size={36}/> GovtNavigator</h1>
        <p>The AI-Powered Guide to Bureaucracy</p>
      </header>

      {!profile ? (
        <OnboardingForm onSubmit={handleProfileSubmit} />
      ) : !selectedScheme ? (
        <div>
          <button 
            onClick={() => setProfile(null)}
            style={{background: 'none', border:'none', color:'var(--text-secondary)', cursor:'pointer', marginBottom: '1rem'}}
          >
            &larr; Back to Profile
          </button>
          <h2>Discovery Results</h2>
          <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>
            We scanned 700+ portals. Here is your gap analysis for {profile.businessType}.
          </p>
          
          {loading ? (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem'}}>
              <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
              <p style={{marginTop: '1rem', color: 'var(--text-secondary)'}}>Sarkari-AI is analyzing your eligibility...</p>
            </div>
          ) : (
            <>
              {error && <p style={{color: 'var(--danger)', marginBottom: '1rem'}}>{error}</p>}
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
            &larr; Back to Schemes
          </button>
          <DependencyGraph scheme={selectedScheme} />
        </div>
      )}
    </div>
  );
}

export default App;
