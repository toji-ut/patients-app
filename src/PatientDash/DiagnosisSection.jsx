import '../styling/diagnosis.css';

function DiagnosisSection({ tempData, setTempData }) {
  return (
    <div className="diagnosis-section">
      <h3>Diagnosis</h3>
      <textarea
        value={tempData.diagnosis || ""}
        onChange={(e) => setTempData({ ...tempData, diagnosis: e.target.value })}
        placeholder="Enter diagnosis..."
      />
    </div>
  );
}

export default DiagnosisSection;