const { connectToDb } = require('./db');
const Patient = require('./models/patient');
const Doctor = require('./models/doctor');
const bcrypt = require('bcryptjs');

async function init() {
  try {
    await connectToDb();
    
    // Create sample doctor 
    const doctor = new Doctor({
      firstName: 'John',
      lastName: 'Maragh',
      username: 'dr_maragh',
      password: await bcrypt.hash('doctor123', 10),
      appointments: []
    });
    await doctor.save();
    
    // Create sample patient 
    const patient = new Patient({
      name: 'Jane Doe',
      username: 'jane_doe',
      password: await bcrypt.hash('patient123', 10),
      dob: '1980-05-15', 
      weight: 68, 
      height: '165cm', 
      bloodType: 'A+',
      records: [] 
    });
    await patient.save();

    process.exit(0);
  
  } catch (err) {
    process.exit(1);
  }
}

init();