import React from 'react';
import propic from '../assets/blank-propic.png';
import '../styling/patient-info.css';

function PatientInfo({ patient }) {
  return (
    <div className="patient-info">
      <div>
        <img src={propic} className="logo-pic" alt="Logo" />
      </div>
      <div className="patient-details">
        <div>
          <h4 className="patient-name">{patient.name}</h4>
        </div>
        <div className="patient-description">
          <div>
            <p>Age: {patient.age}</p>
          </div>
          <div>
            <p>Weight: {patient.weight} lbs</p>
          </div>
          <div>
            <p>DOB: {patient.dob}</p>
          </div>
          <div>
            <p>Height: {patient.height}</p>
          </div>
          <div>
            <p>Blood Type: {patient.bloodType}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientInfo;