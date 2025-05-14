import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import PatientInfo from './PatientInfo';
import SymptomsSection from './SymptomsSection';
import VitalsSection from './VitalsSection';
import MedicalHistory from './MedicalHistory';
import Medications from './Medications';
import TestResults from './TestResults';
import DiagnosisSection from './DiagnosisSection';
import PhysicalExamination from './PhysicalExamination';
import '../styling/patient.css';

function PatientProfile() {

  const [patient, setPatient] = useState({
    name: '',
    age: 0,
    weight: 0,
    height: '',
    bloodType: '',
    symptoms: [],
    vitalSigns: { bloodPressure: '', heartRate: '' },
    medicalHistory: {
      pastMedicalHistory: '',
      allergies: '',
      surgeries: '',
      familyHistory: '',
      socialHistory: ''
    },
    medications: [],
    testResults: [],
    diagnosis: '',
    physicalExam: {
      generalAppearance: '',
      heent: '',
      cardiovascular: '',
      respiratory: '',
      abdominal: '',
      neurological: '',
      musculoskeletal: '',
    },
  });

  const [records, setRecords] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  const [tempData, setTempData] = useState({
    symptoms: [],
    vitalSigns: { bloodPressure: '', heartRate: '' },
    pastMedicalHistory: '',
    allergies: '',
    surgeries: '',
    familyHistory: '',
    socialHistory: '',
    medications: [],
    dosage: '',
    frequency: '',
    duration: '',
    durationUnit: '',
    testResults: null,
    diagnosis: '',
    physicalExam: {
      generalAppearance: '',
      heent: '',
      cardiovascular: '',
      respiratory: '',
      abdominal: '',
      neurological: '',
      musculoskeletal: '',
    },
  });

  const [aiMessages, setAiMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  const [expandedRecordId, setExpandedRecordId] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState('');
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const inactivityTimer = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await authFetch('/api/current-user-role');
        const data = await response.json();
        setUserRole(data.role);
      } catch (err) {
        console.error('Failed to fetch user role:', err);
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userRole === 'patient' && records.length > 0) {
      fetchPatientInsights();
    }
  }, [userRole, records]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await authFetch(`/api/patients/${id}`);
        if (!response.ok) throw new Error('Failed to fetch patient data');
        const data = await response.json();
        setPatient(data);
      } catch (err) {
        console.error('Failed to fetch patient data:', err);
      }
    };
    if (id) fetchPatientData();
  }, [id]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await authFetch(`/api/patients/${id}?populateRecords=true`);
        const data = await response.json();
        setRecords(data.records || []);
      } catch (err) {
        console.error('Failed to load records:', err);
      }
    };
    if (id) fetchRecords();
  }, [id]);


  useEffect(() => {
    if (isEditMode) resetInactivityTimer();
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [tempData, isEditMode]);

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  };

  const fetchPatientInsights = async () => {
    setIsAiLoading(true);
    try {
      const latestRecord = records[records.length - 1] || {};
      
      const response = await authFetch('/api/patient-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: patient.name,
          medications: latestRecord.medications || patient.medications,
          diagnosis: latestRecord.diagnosis || patient.diagnosis,
          symptoms: latestRecord.symptoms || patient.symptoms
        })
      });
  
      const data = await response.json();
      
      setAiMessages([
        {
          id: 1,
          sender: 'ai',
          text: `Hello ${patient.name.split(' ')[0]}, I'm your Health Assistant. Here's what you should know:`
        },
        {
          id: 2,
          sender: 'ai',
          text: data.insights
        }
      ]);
      
    } catch (err) {
      setAiMessages([
        {
          id: 1,
          sender: 'ai',
          text: "Welcome! I'm having trouble accessing your records right now. Please try again later or ask me a question."
        }
      ]);
      console.error('AI insights error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!userMessage.trim() || isAiTyping) return;
    
    // Add user message
    const newMessage = {
      id: Date.now(),
      sender: 'user',
      text: userMessage
    };
    setAiMessages(prev => [...prev, newMessage]);
    setUserMessage('');
    setIsAiTyping(true);
    
    try {
      const response = await authFetch('/api/patient-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: {
            name: patient.name,
            medications: patient.medications,
            diagnosis: patient.diagnosis,
            symptoms: patient.symptoms
          }
        })
      });
  
      const data = await response.json();
      
      setAiMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: data.response
        }
      ]);
      
    } catch (err) {
      setAiMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "Sorry, I'm having trouble responding. Please try again."
        }
      ]);
      console.error('AI chat error:', err);
    } finally {
      setIsAiTyping(false);
    }
  };
  

  const fetchAiSuggestions = async () => {
    setIsAiLoading(true);
    setAiError('');

    try {
      const response = await fetch('http://localhost:3000/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientInfo: {
            name: patient.name,
            age: patient.age,
            weight: patient.weight,
            height: patient.height,
            bloodType: patient.bloodType,
            symptoms: tempData.symptoms.join(', '),
            vitalSigns: tempData.vitalSigns,
            medicalHistory: tempData.medicalHistory,
            physicalExam: tempData.physicalExam,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch AI suggestions.');
      const data = await response.json();
      setAiSuggestions(data.diagnoses);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => fetchAiSuggestions(), 3000);
  };


  const toggleAiPanel = () => setIsAiPanelOpen(!isAiPanelOpen);

  const handleEdit = () => {
    setIsEditMode(true);
    setIsAiPanelOpen(true);
    setTempData({
      symptoms: patient.symptoms || [],
      vitalSigns: patient.vitalSigns || { bloodPressure: '', heartRate: '' },
      pastMedicalHistory: patient.medicalHistory?.pastMedicalHistory || '',
      allergies: patient.medicalHistory?.allergies || '',
      surgeries: patient.medicalHistory?.surgeries || '',
      familyHistory: patient.medicalHistory?.familyHistory || '',
      socialHistory: patient.medicalHistory?.socialHistory || '',
      medications: patient.medications || [],
      dosage: '',
      frequency: '',
      duration: '',
      durationUnit: '',
      testResults: null,
      diagnosis: patient.diagnosis || '',
      physicalExam: patient.physicalExam || {
        generalAppearance: '',
        heent: '',
        cardiovascular: '',
        respiratory: '',
        abdominal: '',
        neurological: '',
        musculoskeletal: '',
      },
    });
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setIsAiPanelOpen(false);
  };

  const handleSave = async () => {
    try {
      const newRecord = {
        symptoms: tempData.symptoms,
        diagnosis: tempData.diagnosis,
        vitalSigns: tempData.vitalSigns,
        medicalHistory: {
          pastMedicalHistory: tempData.pastMedicalHistory,
          allergies: tempData.allergies,
          surgeries: tempData.surgeries,
          familyHistory: tempData.familyHistory,
          socialHistory: tempData.socialHistory
        },
        physicalExam: tempData.physicalExam,
        medications: tempData.medications.map(med => ({
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration ? `${med.duration} ${med.durationUnit}` : ''
        }))
      };

      const response = await authFetch(`/api/doctors/${id}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRecord,
          patientId: id,
          date: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save record');
      }

      const updatedPatient = await response.json();
      
      setPatient(prev => ({
        ...prev,
        ...updatedPatient,
        records: updatedPatient.records || prev.records
      }));
      
      setRecords(updatedPatient.records || []);
      setIsEditMode(false);
      
      
    } catch (err) {
      console.error('Save error:', err);
      setIsEditMode(true);
    }
};

  const toggleRecord = (id) => {
    setExpandedRecordId(expandedRecordId === id ? null : id);
  };

  return (
    <div className="patient-profile">
      <div className="profile-header">
  <h2>PATIENT PROFILE: {patient.name}</h2>
  {userRole === 'doctor' && (
    <button onClick={handleEdit} className="edit-button">
      Edit
    </button>
  )}
</div>

      <PatientInfo patient={patient} />

      {!isEditMode && (
        <div className="records-section">
          <h3>Medical Records</h3>
          {records.length === 0 ? (
            <div className="no-records">
              <p>No medical records available</p>
            </div>
          ) : (
            <div className="records-grid">
              {records.slice().reverse().map((record) => (
                <div
                  key={record._id}
                  className={`record-item ${expandedRecordId === record._id ? 'expanded' : ''}`}
                  onClick={() => toggleRecord(record._id)}
                >
                  <div className="record-summary">
                    <div className="record-header">
                      <span className="record-date">
                        {new Date(record.date).toLocaleString()}
                      </span>
                      {record.diagnosis && (
                        <span className="record-diagnosis-tag">
                          {record.diagnosis.split('\n')[0]}
                        </span>
                      )}
                    </div>
                  </div>

            {expandedRecordId === record._id && (
              <div className="record-details">

                {record.symptoms?.length > 0 && (
                  <div className="detail-group">
                    <h4>Symptoms</h4>
                    <ul className="symptoms-list">
                      {record.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="detail-group">
                  <h4>Vital Signs</h4>
                  <div className="vitals-details">
                    <div className="vitals-grid">
                      <div>
                        <strong>Blood Pressure:</strong>
                        <span>{record.vitalSigns.bloodPressure || '--/--'} mmHg</span>
                      </div>
                      <div>
                        <strong>Heart Rate:</strong>
                        <span>{record.vitalSigns.heartRate || '--'} bpm</span>
                      </div>
                      <div>
                        <strong>Temperature:</strong>
                        <span>{record.vitalSigns.temperature || '--'} °F</span>
                      </div>
                      <div>
                        <strong>Respiratory Rate:</strong>
                        <span>{record.vitalSigns.respiratoryRate || '--'} breaths/min</span>
                      </div>
                      <div>
                        <strong>Oxygen Sat:</strong>
                        <span>{record.vitalSigns.oxygenSaturation || '--'}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {record.physicalExam && (
  <div className="detail-group">
    <h4>Physical Examination</h4>
    <p>General Appearance: {record.physicalExam.generalAppearance}</p>
    <p>HEENT: {record.physicalExam.heent}</p>
    <p>Cardiovascular: {record.physicalExam.cardiovascular}</p>
    <p>Respiratory: {record.physicalExam.respiratory}</p>
    <p>Abdominal:{record.physicalExam.abdominal}</p>
    <p>Neurological:{record.physicalExam.neurological}</p>
    <p>Musculoskeletal:{record.physicalExam.musculoskeletal}</p>
  </div>
)}

{record.medicalHistory && (
  <div className="detail-group">
    <h4>Medical History</h4>
    <div className="medical-history-details">
      {record.medicalHistory.pastMedicalHistory && (
        <div className="history-section">
          <h5>Past Medical History</h5>
          <p>{record.medicalHistory.pastMedicalHistory || 'No significant past medical history'}</p>
        </div>
      )}
      
      {record.medicalHistory.allergies && (
        <div className="history-section">
          <h5>Allergies</h5>
          <p>{record.medicalHistory.allergies || 'No known allergies'}</p>
        </div>
      )}
      
      {record.medicalHistory.surgeries && (
        <div className="history-section">
          <h5>Surgeries</h5>
          <p>{record.medicalHistory.surgeries || 'No surgical history'}</p>
        </div>
      )}
      
      {record.medicalHistory.familyHistory && (
        <div className="history-section">
          <h5>Family History</h5>
          <p>{record.medicalHistory.familyHistory || 'No significant family history'}</p>
        </div>
      )}
      
      {record.medicalHistory.socialHistory && (
        <div className="history-section">
          <h5>Social History</h5>
          <p>{record.medicalHistory.socialHistory || 'No significant social history'}</p>
        </div>
      )}
    </div>
  </div>
)}

                {record.medications?.length > 0 && (
                  <div className="detail-group">
                    <h4>Medications</h4>
                    <div className="medications-list">
                      {record.medications.map((med, index) => (
                        <div key={index} className="medication-item">
                          <div className="med-name"><strong>{med.name}</strong></div>
                          {med.dosage && <div className="med-dosage">{med.dosage}mg</div>}
                          {med.frequency && <div className="med-frequency">{med.frequency}</div>}
                          {med.duration && <div className="med-duration">for {med.duration}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {record.diagnosis && (
                  <div className="detail-group">
                    <h4>Diagnosis</h4>
                    <div className="diagnosis-content">
                      {record.diagnosis.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                )}

                {record.testResults && (
                  <div className="detail-group">
                    <h4>Test Results</h4>
                    <div className="test-results">
                      <p>
                        <strong>{record.testResults.name}</strong>
                        {record.testResults.size && (
                          <span> ({Math.round(record.testResults.size / 1024)} KB)</span>
                        )}
                      </p>
                      {record.testResults.date && (
                        <p>Uploaded: {record.testResults.date}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
)}

      {isEditMode && (
        <div className="medical-info">
          <MedicalHistory
            patient={patient}
            isEditMode={isEditMode}
            tempData={tempData}
            setTempData={setTempData}
          />
          <SymptomsSection
            patient={patient}
            isEditMode={isEditMode}
            tempData={tempData}
            setTempData={setTempData}
          />
          <VitalsSection
            patient={patient}
            isEditMode={isEditMode}
            tempData={tempData}
            setTempData={setTempData}
          />
          <PhysicalExamination
            patient={patient}
            isEditMode={isEditMode}
            tempData={tempData}
            setTempData={setTempData}
          />
          <TestResults
            patient={patient}
            isEditMode={isEditMode}
            tempData={tempData}
            setTempData={setTempData}
          />
          <DiagnosisSection
            patient={patient}
            isEditMode={isEditMode}
            tempData={tempData}
            setTempData={setTempData}
          />
          <Medications
            patient={patient}
            isEditMode={isEditMode}
            tempData={tempData}
            setTempData={setTempData}
          />
        </div>
      )}

      {isEditMode && (
        <div className="edit-controls">
          <button onClick={handleSave} className="save-button">
            Save
          </button>
          <button onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      )}

      {isEditMode && (
        <div className={`ai-panel ${isAiPanelOpen ? 'open' : ''}`}>
          <button onClick={toggleAiPanel} className="ai-toggle-button">
            {isAiPanelOpen ? '✕' : 'AI'}
          </button>
          {isAiPanelOpen && (
            <div className="ai-content">
              <h3>AI Medical Suggestions</h3>
              {isAiLoading ? (
                <p>Loading suggestions...</p>
              ) : aiError ? (
                <p style={{ color: 'red' }}>{aiError}</p>
              ) : (
                <pre>{aiSuggestions}</pre>
              )}
            </div>
          )}
        </div>
      )}

{userRole === 'patient' && (
  <div className="patient-ai-panel">
    <div className="ai-chat-header">
      <h3><i className="fas fa-robot"></i> Health Information</h3>
      <p className="ai-subheader">Based on your medical records</p>
    </div>
    
    <div className="ai-info-messages">
      {aiMessages.map(msg => (
        <div key={msg.id} className="info-message">
          {msg.text.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      ))}
      {isAiLoading && (
        <div className="loading-indicator">
          <span>•</span>
          <span>•</span>
          <span>•</span>
        </div>
      )}
    </div>
    
    <div className="ai-info-footer">
      <p className="disclaimer">
        <i className="fas fa-info-circle"></i> For medical advice, please consult your doctor
      </p>
    </div>
  </div>
)}
    </div>
  );
}

export default PatientProfile;