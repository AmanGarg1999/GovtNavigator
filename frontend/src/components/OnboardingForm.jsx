import React, { useState } from 'react';
import { 
  ALL_STATES, 
  ALL_SECTORS, 
  GENDER_OPTIONS, 
  EDUCATION_LEVELS, 
  SOCIAL_CATEGORIES,
  ENTERPRISE_TYPES 
} from '../constants';

export default function OnboardingForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    age: '',
    state: 'Maharashtra',
    businessType: 'Manufacturing',
    projectCost: '',
    gender: 'Male',
    education: 'Graduate',
    socialCategory: 'General',
    enterpriseType: 'Proprietorship'
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.age || formData.age < 18 || formData.age > 85) {
      newErrors.age = "Age must be between 18 and 85.";
    }
    if (!formData.projectCost || formData.projectCost <= 0) {
      newErrors.projectCost = "Please enter a valid project cost.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleSkip = () => {
    onSubmit(null);
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Citizen Profile</h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' }}>
        Your details are encrypted and used only for personalized eligibility matching.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input 
              id="age"
              type="number" 
              name="age" 
              className={`form-control ${errors.age ? 'error' : ''}`}
              placeholder="e.g. 28" 
              value={formData.age}
              onChange={handleChange}
              required 
            />
            {errors.age && <span className="error-text">{errors.age}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" className="form-control" value={formData.gender} onChange={handleChange}>
              {GENDER_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label htmlFor="state">Domicile State</label>
            <select id="state" name="state" className="form-control" value={formData.state} onChange={handleChange}>
              {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="education">Education Level</label>
            <select id="education" name="education" className="form-control" value={formData.education} onChange={handleChange}>
              {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label htmlFor="socialCategory">Social Category</label>
            <select id="socialCategory" name="socialCategory" className="form-control" value={formData.socialCategory} onChange={handleChange}>
              {SOCIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="enterpriseType">Enterprise Entity</label>
            <select id="enterpriseType" name="enterpriseType" className="form-control" value={formData.enterpriseType} onChange={handleChange}>
              {ENTERPRISE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label htmlFor="businessType">Primary Sector</label>
            <select id="businessType" name="businessType" className="form-control" value={formData.businessType} onChange={handleChange}>
              {ALL_SECTORS.map(sec => <option key={sec} value={sec}>{sec}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="projectCost">Proposed Project Cost (INR)</label>
            <input 
              id="projectCost"
              type="number" 
              name="projectCost" 
              className={`form-control ${errors.projectCost ? 'error' : ''}`}
              placeholder="e.g. 1000000" 
              value={formData.projectCost}
              onChange={handleChange}
              required 
            />
            {errors.projectCost && <span className="error-text">{errors.projectCost}</span>}
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.2rem' }}>
            Run Bureaucratic Analysis
          </button>
          <button 
            type="button" 
            onClick={handleSkip}
            className="btn-secondary"
            style={{ marginTop: '1rem' }}
          >
            Explore National Registry (Anonymous)
          </button>
        </div>
      </form>
    </div>
  );
}
