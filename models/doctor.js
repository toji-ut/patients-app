const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;