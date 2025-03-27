import React from 'react';
import '../styling/physical.css';

function PhysicalExamination({ tempData, setTempData }) {
  return (
    <div className="medical-section">
      <h4>Physical Examination</h4>

      {/* General Appearance */}
      <div className="history-subsection">
        <h5>General Appearance</h5>
        <textarea
          value={tempData.physicalExam.generalAppearance || ""}
          onChange={(e) =>
            setTempData({
              ...tempData,
              physicalExam: {
                ...tempData.physicalExam,
                generalAppearance: e.target.value
              }
            })
          }
          placeholder="Describe general appearance (e.g., Well-developed, no acute distress)..."
        />
      </div>

      {/* HEENT */}
      <div className="history-subsection">
        <h5>HEENT</h5>
        <textarea
          value={tempData.physicalExam.heent || ""}
          onChange={(e) =>
            setTempData({
              ...tempData,
              physicalExam: {
                ...tempData.physicalExam,
                heent: e.target.value
              }
            })
          }
          placeholder="Describe head, eyes, ears, nose, and throat findings..."
        />
      </div>

      {/* Cardiovascular */}
      <div className="history-subsection">
        <h5>Cardiovascular</h5>
        <textarea
          value={tempData.physicalExam.cardiovascular || ""}
          onChange={(e) =>
            setTempData({
              ...tempData,
              physicalExam: {
                ...tempData.physicalExam,
                cardiovascular: e.target.value
              }
            })
          }
          placeholder="Describe cardiovascular findings (e.g., Normal S1/S2, no murmurs)..."
        />
      </div>

      {/* Respiratory */}
      <div className="history-subsection">
        <h5>Respiratory</h5>
        <textarea
          value={tempData.physicalExam.respiratory || ""}
          onChange={(e) =>
            setTempData({
              ...tempData,
              physicalExam: {
                ...tempData.physicalExam,
                respiratory: e.target.value
              }
            })
          }
          placeholder="Describe respiratory findings (e.g.,cya breathe)..."
        />
      </div>

      {/* Abdominal */}
      <div className="history-subsection">
        <h5>Abdominal</h5>
        <textarea
          value={tempData.physicalExam.abdominal || ""}
          onChange={(e) =>
            setTempData({
              ...tempData,
              physicalExam: {
                ...tempData.physicalExam,
                abdominal: e.target.value
              }
            })
          }
          placeholder="Describe abdominal findings (e.g., Soft, non-tender)..."
        />
      </div>

      {/* Neurological */}
      <div className="history-subsection">
        <h5>Neurological</h5>
        <textarea
          value={tempData.physicalExam.neurological || ""}
          onChange={(e) =>
            setTempData({
              ...tempData,
              physicalExam: {
                ...tempData.physicalExam,
                neurological: e.target.value
              }
            })
          }
          placeholder="Describe neurological findings..."
        />
      </div>

      {/* Musculoskeletal */}
      <div className="history-subsection">
        <h5>Musculoskeletal</h5>
        <textarea
          value={tempData.physicalExam.musculoskeletal || ""}
          onChange={(e) =>
            setTempData({
              ...tempData,
              physicalExam: {
                ...tempData.physicalExam,
                musculoskeletal: e.target.value
              }
            })
          }
          placeholder="Describe musculoskeletal findings (e.g., Normal range of motion, no deformities)..."
        />
      </div>
    </div>
  );
}

export default PhysicalExamination;