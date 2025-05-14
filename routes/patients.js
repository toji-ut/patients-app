const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const Record = require('../models/record');
const mongoose = require('mongoose');

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

router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find().select('-password');
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch patients' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let patient = await Patient.findById(req.params.id)
      .populate('records')
      .lean();

    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    patient = {
      ...patient,
      age: calculateAge(patient.dob),
      symptoms: patient.symptoms || [],
      medications: patient.medications || [],
      medicalHistory: patient.medicalHistory || {
        pastMedicalHistory: '',
        allergies: '',
        surgeries: '',
        familyHistory: '',
        socialHistory: ''
      },
      physicalExam: patient.physicalExam || {
        generalAppearance: '',
        heent: '',
        cardiovascular: '',
        respiratory: '',
        abdominal: '',
        neurological: '',
        musculoskeletal: ''
      }
    };

    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/search', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ error: "No search query provided" });

        const patients = await Patient.find({ name: { $regex: query, $options: "i" } });
        res.json(patients);
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ error: "Server error" });
    }
});



module.exports = router;
