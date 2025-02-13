import { useState } from "react";

function PatientBoard() {
  const patient = {
    name: "John Doe",
    age: 45,
    condition: "Diabetes",
    history: [
      { date: "2024-01-20", event: "Diagnosed with Diabetes" },
      { date: "2024-02-05", event: "Follow-up Visit - Blood Sugar Levels Stable" },
    ],
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice a day" },
    ],
    results: [
      { date: "2024-02-05", test: "Blood Sugar", result: "120 mg/dL" },
    ],
    diagnoses: [
      { date: "2024-01-20", diagnosis: "Type 2 Diabetes" },
    ],
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Patient Dashboard</h1>
      </header>
      
      {/* Main Content */}
      <div style={styles.content}>
        {/* Patient Info */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Patient Information</h2>
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Condition:</strong> {patient.condition}</p>
        </div>

        {/* Medical History */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Medical History</h2>
          <ul style={styles.list}>
            {patient.history.map((item, index) => (
              <li key={index} style={styles.listItem}>
                <strong>{item.date}:</strong> {item.event}
              </li>
            ))}
          </ul>
        </div>

        {/* Medications */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Medications</h2>
          <ul style={styles.list}>
            {patient.medications.map((med, index) => (
              <li key={index} style={styles.listItem}>
                <strong>{med.name}:</strong> {med.dosage}, {med.frequency}
              </li>
            ))}
          </ul>
        </div>

        {/* Test Results */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Test Results</h2>
          <ul style={styles.list}>
            {patient.results.map((result, index) => (
              <li key={index} style={styles.listItem}>
                <strong>{result.date}:</strong> {result.test} - {result.result}
              </li>
            ))}
          </ul>
        </div>

        {/* Diagnoses */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Diagnoses</h2>
          <ul style={styles.list}>
            {patient.diagnoses.map((diag, index) => (
              <li key={index} style={styles.listItem}>
                <strong>{diag.date}:</strong> {diag.diagnosis}
              </li>
            ))}
          </ul>
        </div>

        {/* AI Support Panel */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>AI Support Panel</h2>
          <div style={styles.aiContent}>
            <p style={styles.aiText}><strong>Diagnosis:</strong> {patient.condition}</p>
            <p style={styles.aiText}><strong>Medications:</strong></p>
            <ul style={styles.list}>
              {patient.medications.map((med, index) => (
                <li key={index} style={styles.listItem}>
                  {med.name} - {med.dosage}, {med.frequency}
                </li>
              ))}
            </ul>
            <button style={styles.button} onClick={() => handleAIInsights(patient)}>Get AI Insights</button>
            {/* AI Insights would be displayed here */}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#f0f4f8',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '2rem',
    textAlign: 'center',
    color: '#2c3e50',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  section: {
    backgroundColor: 'white',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    marginBottom: '10px',
    color: '#2c3e50',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    padding: '10px 0',
    borderBottom: '1px solid #ccc',
  },
  aiContent: {
    padding: '10px 0',
  },
  aiText: {
    marginBottom: '10px',
  },
  button: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#2980b9',
  },
};

const handleAIInsights = (patient) => {
  // Implement AI insights function here
  // For example, use patient data to generate insights about medications, diagnosis, etc.
};

export default PatientBoard;
