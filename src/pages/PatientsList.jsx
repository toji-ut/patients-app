import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/patient.css';

function PatientsList() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/patients-list', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch patients');
                }

                const data = await response.json();
                setPatients(data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const handlePatientClick = (patientId) => {
        navigate(`/patient/${patientId}`);
    };

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div className="loading">Loading patients...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="patients-container">
            <h1>Patient List</h1>
            
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            
            <div className="patients-list">
                {filteredPatients.length > 0 ? (
                    <table className="patients-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Blood Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map(patient => (
                                <tr 
                                    key={patient._id} 
                                    onClick={() => handlePatientClick(patient._id)}
                                    className="patient-row"
                                >
                                    <td>{patient.name}</td>
                                    <td>{patient.age}</td>
                                    {/* <td>{patient.gender || 'N/A'}</td> */}
                                    <td>{patient.bloodType || 'N/A'}</td>
                                    <td>
                                        {/* {patient.lastVisit 
                                            ? new Date(patient.lastVisit).toLocaleDateString() 
                                            : 'N/A'} */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-patients">
                        {searchTerm ? 
                            'No patients match your search' : 
                            'No patients found in the system'}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PatientsList;