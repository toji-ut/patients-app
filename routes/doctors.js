const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const Record = require('../models/record');

// calculate age from DOB
function calculateAge(dob) {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

router.get('/search-patients', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const patients = await Patient.find({ name: { $regex: query, $options: 'i' } })
      .populate('records')
      .select('-__v');

    const patientsWithAge = patients.map(patient => ({
      ...patient._doc,
      age: calculateAge(patient.dob)
    }));

    res.json(patientsWithAge);
  } catch (err) {
    console.error('Doctor search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/:id/records', async (req, res) => {
  try {
    const tempDoctorId = '67e35ca5ca55848ff133b72d'; 
     console.log('Received record data:', req.body); 
     console.log('For patient ID:', req.params.id);  

    if (!req.body.symptoms || !req.body.diagnosis) {
      return res.status(400).json({ error: 'Symptoms and diagnosis are required' });
    }

    const record = new Record({
      ...req.body,
      patientId: req.params.id,
      doctorId: tempDoctorId, 
      date: new Date()
    });

    await record.save();

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $push: { records: record._id } },
      { new: true }
    ).populate('records');

    res.status(201).json(updatedPatient);
  } catch (err) {
    console.error('Create record error:', err);
    res.status(500).json({ error: 'Failed to create record' });
  }
});

module.exports = router;