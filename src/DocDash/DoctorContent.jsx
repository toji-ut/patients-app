import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DoctorContent() {
  const styles = {
    container: {
      padding: '2em 0px 0px 15em',
      display: 'flex',
      flexDirection: 'column',
      marginTop: '2em',
      backgroundColor: '#ECF0F1',
      fontFamily: 'Poppins',
    },
    headers: {
      marginBottom: '1rem',
      color: '#34495E',
      fontWeight: 'bold',
      textAlign: 'left',
      fontSize: '1.5rem',
      width: '100%',
    },
    reminderLayouts: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: '2rem',
      marginBottom: '2rem',
    },
    reminders: {
      padding: '1.5rem',
      border: '2px solid black',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      color: '#2C3E50',
      fontWeight: '500',
      textAlign: 'left',
      flex: '1',
      maxWidth: '25em',
      height: '10em',
    },
    searchLayout: {
      padding: '1.5em',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      border: '2px solid black',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      color: '#333',
      width: '55%',
      marginTop: '2em',
      alignSelf: 'flex-start',
    },
    searchInput: {
      padding: '0.8em',
      margin: '1em 0',
      borderRadius: '6px',
      border: '1px solid black',
      width: '60%',
      fontSize: '1rem',
    },
    patientInfo: {
      color: '#555',
      textAlign: 'left',
      margin: '1em 0',
      width: '100%',
    },
    patientCard: {
      padding: '0.8em',
      margin: '0.5em 0',
      border: '1px solid #ddd',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#f5f5f5',
      },
    },
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`/api/doctors/search-patients?query=${query}`); 
      const data = await response.json(); 
      
      if (Array.isArray(data)) { 
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]); 
    } finally {
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 1) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handlePatientClick = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.headers}>
        <h1>Welcome Dr. Maragh</h1>
      </div>

      <div style={styles.reminderLayouts}>
        <div style={styles.reminders}>
          <h4>Upcoming Appointments</h4>
        </div>
        <div style={styles.reminders}>
          <h4>Notifications</h4>
        </div>
      </div>

      <div style={styles.searchLayout}>
        <div style={styles.headers}>
          <h3>Search Patients</h3>
        </div>
        <input
          type="text"
          placeholder="Search by name..."
          style={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div style={styles.patientInfo}>
          {(() => {
            if (searchResults.length > 0) {
              return (
                <div className="patient-list">
                  {searchResults.map((patient) => (
                    <div
                      key={patient._id}
                      style={styles.patientCard}
                      onClick={() => handlePatientClick(patient._id)}
                    >
                      <p>
                        <strong>{patient.name}</strong>
                      </p>
                      <p>Age: {patient.age}</p>
                    </div>
                  ))}
                </div>
              );
            } else if (searchResults.length === 0 && searchQuery.length > 1) {
              return <p>No patients found</p>;
            }
            return null; 
          })()}
        </div>
      </div>
    </div>
  );
}

export default DoctorContent;