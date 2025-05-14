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
    
    // Create sample patients
    const patients = [
      {
        name: 'Michael Smith',
        username: 'mike_smith',
        password: await bcrypt.hash('patient456', 10),
        dob: '1975-11-22',
        weight: 82,
        height: '178cm',
        bloodType: 'B-',
        records: []
      },
      {
        name: 'Sarah Johnson',
        username: 'sarah_j',
        password: await bcrypt.hash('patient789', 10),
        dob: '1990-03-08',
        weight: 59,
        height: '162cm',
        bloodType: 'O+',
        records: []
      },
      {
        name: 'David Wilson',
        username: 'dave_wilson',
        password: await bcrypt.hash('patient101', 10),
        dob: '1988-07-14',
        weight: 75,
        height: '180cm',
        bloodType: 'AB+',
        records: []
      },
      {
        name: 'Emily Brown',
        username: 'emily_b',
        password: await bcrypt.hash('patient112', 10),
        dob: '1995-09-30',
        weight: 63,
        height: '170cm',
        bloodType: 'A-',
        records: []
      },
      {
        name: 'Robert Taylor',
        username: 'rob_taylor',
        password: await bcrypt.hash('patient131', 10),
        dob: '1972-12-05',
        weight: 90,
        height: '185cm',
        bloodType: 'O-',
        records: []
      }
    ];

    // Save all patients
    for (const patientData of patients) {
      const patient = new Patient(patientData);
      await patient.save();
    }

    process.exit(0);
  
  } catch (err) {
    console.error('Error initializing data:', err);
    process.exit(1);
  }
}

init();