const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicalRecordSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, default: Date.now }, 
  
  symptoms: [[String]],
  diagnosis: String,
  vitalSigns: {
    bloodPressure: String,
    heartRate: String,
    temperature: String,
    respiratoryRate: String,
    oxygenSaturation: String
  },
  physicalExam: {
    generalAppearance: String,
    heent: String,
    cardiovascular: String,
    respiratory: String,
    abdominal: String,
    neurological: String,
    musculoskeletal: String
  },
  medicalHistory: {
    pastMedicalHistory: String,
    allergies: String,
    surgeries: String,
    familyHistory: String,
    socialHistory: String
  },
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  testResults: {
    name: String,
    size: Number,
    type: String,
    date: Date
  }
}, { timestamps: true });

const Record = mongoose.model('Record', medicalRecordSchema);
module.exports = Record;