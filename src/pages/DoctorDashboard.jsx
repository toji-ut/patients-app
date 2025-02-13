import { useState } from "react";

function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const patients = [
    { id: 1, name: "John Doe", age: 45, condition: "Diabetes", lastVisit: "2024-02-05" },
    { id: 2, name: "Jane Smith", age: 38, condition: "Hypertension", lastVisit: "2024-01-20" },
  ];

  return (
    <div style={styles.container}>
      {/* Navigation Bar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Doctor Panel</h2>
        <ul style={styles.sidebarList}>
          <li style={styles.sidebarListItem}>Dashboard</li>
          <li style={styles.sidebarListItem}>Patients</li>
          <li style={styles.sidebarListItem}>Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <h1 style={styles.contentTitle}>Doctor's Dashboard</h1>
        
        {/* Dashboard Overview */}
        <div style={styles.box}>
          <h2 style={styles.boxTitle}>Upcoming Appointments</h2>
          {/* Display upcoming appointments */}
        </div>
        <div style={styles.box}>
          <h2 style={styles.boxTitle}>Notifications</h2>
          {/* Display notifications */}
        </div>

        {/* Patients Page */}
        <div style={styles.box}>
          <h2 style={styles.boxTitle}>Search Patient</h2>
          <input type="text" placeholder="Search by name or condition..." style={styles.input} />
          <ul style={styles.list}>
            {patients.map((patient) => (
              <li
                key={patient.id}
                style={styles.listItem}
                onClick={() => setSelectedPatient(patient)}
              >
                {patient.name} - {patient.condition}
              </li>
            ))}
          </ul>
        </div>

        {/* Patient Details */}
        {selectedPatient && (
          <div style={styles.box}>
            <h2 style={styles.boxTitle}>Patient Details</h2>
            <p><strong>Name:</strong> {selectedPatient.name}</p>
            <p><strong>Age:</strong> {selectedPatient.age}</p>
            <p><strong>Condition:</strong> {selectedPatient.condition}</p>
            <p><strong>Last Visit:</strong> {selectedPatient.lastVisit}</p>
            <textarea placeholder="Add appointment notes..." style={styles.textarea}></textarea>
            <button style={styles.button} onClick={() => handleAIAnalysis()}>Analyze with AI</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f0f4f8',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px',
  },
  sidebarTitle: {
    fontSize: '1.5rem',
    marginBottom: '20px',
  },
  sidebarList: {
    listStyle: 'none',
    padding: 0,
  },
  sidebarListItem: {
    marginBottom: '10px',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  sidebarListItemHover: {
    backgroundColor: '#34495e',
  },
  content: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
  },
  contentTitle: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  box: {
    backgroundColor: 'white',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  boxTitle: {
    fontSize: '1.25rem',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    marginTop: '10px',
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  listItemHover: {
    backgroundColor: '#f0f4f8',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
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

export default DoctorDashboard;
