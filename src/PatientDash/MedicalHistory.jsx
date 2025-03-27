import React from 'react';
import '../styling/history.css';

function MedicalHistory({ tempData, setTempData }) {
  return (
    <div className="medical-section">
      <h4>Medical History</h4>

      {/* Past Medical History */}
      <div className="history-subsection">
        <h5>Past Medical History</h5>
        <textarea
          value={tempData.pastMedicalHistory || ""}
          onChange={(e) => setTempData({...tempData, pastMedicalHistory: e.target.value})}
          placeholder="Hypertension, Diabetes, Asthma..."
        />
      </div>

      {/* Surgeries */}
      <div className="history-subsection">
        <h5>Surgeries</h5>
        <textarea
          value={tempData.surgeries || ""}
          onChange={(e) => setTempData({...tempData, surgeries: e.target.value})}
          placeholder="Appendectomy (2015), Tonsillectomy..."
        />
      </div>

      {/* Allergies */}
      <div className="history-subsection">
        <h5>Allergies</h5>
        <textarea
          value={tempData.allergies || ""}
          onChange={(e) => setTempData({...tempData, allergies: e.target.value})}
          placeholder="Penicillin, Peanuts, Latex..."
        />
      </div>

      {/* Family History */}
      <div className="history-subsection">
        <h5>Family History</h5>
        <textarea
          value={tempData.familyHistory || ""}
          onChange={(e) => setTempData({...tempData, familyHistory: e.target.value})}
          placeholder="Father: Heart disease, Mother: Diabetes..."
        />
      </div>

      {/* Social History */}
      <div className="history-subsection">
        <h5>Social History</h5>
        <textarea
          value={tempData.socialHistory || ""}
          onChange={(e) => setTempData({...tempData, socialHistory: e.target.value})}
          placeholder="Smoking: 10 pack-years, Alcohol: 2 drinks/week..."
        />
      </div>
    </div>
  );
}

export default MedicalHistory;