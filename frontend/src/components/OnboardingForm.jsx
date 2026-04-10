import React, { useState } from 'react';

export default function OnboardingForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    age: '',
    state: 'Uttar Pradesh',
    businessType: 'Manufacturing',
    projectCost: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Citizen Profile</h2>
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
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Delhi">Delhi</option>
            <option value="Maharashtra">Maharashtra</option>
          </select>
        </div>
        <div className="form-group">
          <label>Enterprise Type</label>
          <select name="businessType" className="form-control" value={formData.businessType} onChange={handleChange}>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Service">Service</option>
            <option value="Retail">Retail</option>
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
        <button type="submit" className="btn-primary">Run Gap Analysis Mode</button>
      </form>
    </div>
  );
}
