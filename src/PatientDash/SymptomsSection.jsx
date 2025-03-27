import React, { useState, useEffect } from 'react';
import '../styling/symptoms.css';

function SymptomsSection({ patient, isEditMode, tempData, setTempData }) {
  const [symptomsQuery, setSymptomsQuery] = useState('');
  const [symptomsSuggestions, setSymptomsSuggestions] = useState([]);

  useEffect(() => {
    if (symptomsQuery.length > 2) {
      fetchSymptomsSuggestions(symptomsQuery);
    } else {
      setSymptomsSuggestions([]);
    }
  }, [symptomsQuery]);

  const fetchSymptomsSuggestions = async (query) => {
    const apiUrl = `https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data && data[3]) {
        setSymptomsSuggestions(data[3]);
      }
    } catch (error) {
      console.error('Error fetching symptoms suggestions:', error);
      setSymptomsSuggestions([]);
    }
  };

  const handleSymptomSelect = (symptom) => {
    setTempData((prevTempData) => ({
      ...prevTempData,
      symptoms: [...prevTempData.symptoms, symptom],
    }));
    setSymptomsQuery('');
    setSymptomsSuggestions([]);
  };

  const handleRemoveSymptom = (index) => {
    setTempData((prevTempData) => ({
      ...prevTempData,
      symptoms: prevTempData.symptoms.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="symptoms-section">
      <h4>Symptoms</h4>

      {isEditMode && (
        <div className="symptoms-input">
          <input
            type="text"
            placeholder="Search symptoms..."
            value={symptomsQuery}
            onChange={(e) => setSymptomsQuery(e.target.value)}
          />

          {symptomsSuggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {symptomsSuggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSymptomSelect(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}

          {tempData.symptoms.length > 0 && (
            <div className="selected-symptoms">
              <h5>Selected Symptoms:</h5>
              <ul>
                {tempData.symptoms.map((symptom, index) => (
                  <li key={index} className="symptom-item">
                    {symptom}
                    <button className="remove-btn" onClick={() => handleRemoveSymptom(index)}>
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

export default SymptomsSection;