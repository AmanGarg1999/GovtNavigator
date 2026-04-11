import React, { useState } from 'react';
import { ALL_STATES, ALL_SECTORS } from '../constants';

export default function OnboardingForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    age: '28',
    state: 'Uttar Pradesh',
    businessType: 'Manufacturing',
    projectCost: '1000000'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSkip = () => {
    onSubmit(null); // Passing null indicates browsing mode
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Citizen Profile</h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Provide details for personalized eligibility analysis, or skip to browse all schemes.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Age</label>
          <input 
            type="number" 
            name="age" 
            className="form-control" 
            placeholder="e.g. 28" 
            value={formData.age}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="form-group">
          <label>Domicile State</label>
          <select name="state" className="form-control" value={formData.state} onChange={handleChange}>
            {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Enterprise Type / Sector</label>
          <select name="businessType" className="form-control" value={formData.businessType} onChange={handleChange}>
            {ALL_SECTORS.map(sec => <option key={sec} value={sec}>{sec}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Proposed Project Cost (INR)</label>
          <input 
            type="number" 
            name="projectCost" 
            className="form-control" 
            placeholder="e.g. 2000000" 
            value={formData.projectCost}
            onChange={handleChange}
            required 
          />
        </div>
        <button type="submit" className="btn-primary">Run AI Analysis</button>
        <button 
          type="button" 
          onClick={handleSkip}
          className="btn-secondary"
          style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem' }}
        >
          Skip to Browse All Schemes
        </button>
      </form>
    </div>
  );
}
