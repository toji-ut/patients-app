import React from 'react';
import '../styling/vitals.css';

function VitalsSection({ isEditMode, tempData, setTempData }) {
  if (!isEditMode) {
    return null; 
  }

  return (
    <div className="vitals-section">
      <h4>Vital Signs</h4>
      <div className="vitals-input">
        {[
          { label: "Blood Pressure", key: "bloodPressure", placeholder: "120/80", unit: "mmHg" },
          { label: "Heart Rate", key: "heartRate", placeholder: "72", unit: "bpm" },
          { label: "Temperature", key: "temperature", placeholder: "98.6", unit: "°F" },
          { label: "Respiratory Rate", key: "respiratoryRate", placeholder: "16", unit: "breaths/min" },
          { label: "Oxygen Saturation", key: "oxygenSaturation", placeholder: "98", unit: "%" }
        ].map(({ label, key, placeholder, unit }) => (
          <label key={key}>
            {label}
            <div className="input-wrapper">
              <input
                type="text"
                value={tempData.vitalSigns[key] || ''}
                onChange={(e) =>
                  setTempData({
                    ...tempData,
                    vitalSigns: { ...tempData.vitalSigns, [key]: e.target.value },
                  })
                }
                placeholder={placeholder}
              />
              <span className="unit">{unit}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

export default VitalsSection;