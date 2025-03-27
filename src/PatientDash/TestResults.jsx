import React from 'react';
import '../styling/results.css';

function TestResults({ isEditMode, tempData, setTempData }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempData({ ...tempData, testResults: file });
    }
  };

  if (!isEditMode) {
    return null; 
  }

  return (
    <div className="medical-section">
      <h4>Lab Results</h4>
      <div>
        <input type="file" onChange={handleFileUpload} />
        {tempData.testResults && (
          <p>
            {tempData.testResults.name} ({Math.round(tempData.testResults.size / 1024)} KB)
          </p>
        )}
      </div>
    </div>
  );
}

export default TestResults;