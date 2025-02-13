import React, { useState } from 'react';

function TestChat() {
  const [patientInfo, setPatientInfo] = useState('');
  const [diagnoses, setDiagnoses] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDiagnoses('');

    try {
      const response = await fetch('http://localhost:3000/api/diagnose', {  // Updated API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientInfo }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch diagnoses.');
      }

      const data = await response.json();
      setDiagnoses(data.diagnoses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>AI Diagnosis Assistant</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={patientInfo}
          onChange={(e) => setPatientInfo(e.target.value)}
          placeholder="Enter patient information here..."
          rows="5"
          cols="50"
          required
        ></textarea>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Get Diagnoses'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {diagnoses && (
        <div>
          <h2>Possible Diagnoses:</h2>
          <pre>{diagnoses}</pre>
        </div>
      )}
    </div>
  );
}

export default TestChat;
