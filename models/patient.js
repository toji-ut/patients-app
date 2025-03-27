const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: String, required: true },
  weight: { type: Number, required: true },
  height: { type: String, required: true },
  bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  records: [{ type: Schema.Types.ObjectId, ref: 'Record' }],
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;