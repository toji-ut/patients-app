import React, { useState, useEffect } from 'react';
import '../styling/medications.css';

function Medications({ patient, isEditMode, tempData, setTempData }) {
  const [medicationsQuery, setMedicationsQuery] = useState('');
  const [medicationsSuggestions, setMedicationsSuggestions] = useState([]);

  useEffect(() => {
    if (medicationsQuery.length > 2) {
      fetchMedications(medicationsQuery);
    } else {
      setMedicationsSuggestions([]);
    }
  }, [medicationsQuery]);

  const fetchMedications = async (query) => {
    try {
      const response = await fetch(
        `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${query}&maxEntries=10`
      );
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      if (data.approximateGroup?.candidate) {
        const medications = data.approximateGroup.candidate
          .filter((drug) => drug.name)
          .map((drug) => drug.name);
        setMedicationsSuggestions(medications);
      }
    } catch (error) {
      console.error('Error fetching RxNorm data:', error);
      setMedicationsSuggestions([]);
    }
  };

  const handleMedicationSelect = (medication) => {
    setTempData((prevTempData) => ({
      ...prevTempData,
      medications: [
        ...prevTempData.medications,
        { name: medication, dosage: '', frequency: '', duration: '', durationUnit: '' },
      ],
    }));
    setMedicationsQuery('');
    setMedicationsSuggestions([]);
  };

  const handleRemoveMedication = (index) => {
    setTempData((prevTempData) => ({
      ...prevTempData,
      medications: prevTempData.medications.filter((_, i) => i !== index),
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    setTempData((prevTempData) => ({
      ...prevTempData,
      medications: prevTempData.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      ),
    }));
  };

  return (
    <div className="medical-section">
      <h4>Medications</h4>

      {isEditMode && (
        <div className="medications-input">
          <input
            type="text"
            placeholder="Search medications..."
            value={medicationsQuery}
            onChange={(e) => setMedicationsQuery(e.target.value)}
          />

          {medicationsSuggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {medicationsSuggestions.map((medication, index) => (
                <li key={index} onClick={() => handleMedicationSelect(medication)}>
                  {medication}
                </li>
              ))}
            </ul>
          )}

          {tempData.medications.length > 0 && (
            <div className="selected-medications">
              <h5>Selected Medications:</h5>
              <ul>
                {tempData.medications.map((medication, index) => (
                  <li key={index} className="medication-item">
                    <div className="medication-info">
                      <span className="medication-name">{medication.name}</span>
                      <div className="medication-details">
                        <label>
                          Dosage:
                          <input
                            type="number"
                            value={medication.dosage}
                            onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                            placeholder="mg"
                          />
                        </label>
                        <label>
                          Frequency:
                          <input
                            type="text"
                            value={medication.frequency}
                            onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                            placeholder="e.g. 2x daily"
                          />
                        </label>
                        <label>
                          Duration:
                          <input
                            type="text"
                            value={medication.duration}
                            onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                          />
                          <select
                            value={medication.durationUnit}
                            onChange={(e) => handleMedicationChange(index, 'durationUnit', e.target.value)}
                          >
                            <option value="">Unit</option>
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                          </select>
                        </label>
                      </div>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveMedication(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Medications;