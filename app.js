const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();
const { connectToDb } = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');

const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');

// Models
const Patient = require('./models/patient');
const Doctor = require('./models/doctor');

// Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

//  JWT endpoint
app.get('/api/current-user-role', authMiddleware, (req, res) => {
    res.json({ 
        role: req.role,
        userId: req.user._id 
    });
});

// Get all patients 
app.get('/api/patients-list', async (req, res) => {
    try {
        const patients = await Patient.find().select('-password -__v');
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch patients' });
    }
});

// Get all doctors 
app.get('/api/doctors-list', async (req, res) => {
    try {
        const doctors = await Doctor.find().select('-password -__v');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch doctors' });
    }
});

// /api/login endpoint 
app.post('/api/login', async (req, res) => {
  try {

    const user = await Doctor.findOne({ username: req.body.username }) || 
                 await Patient.findOne({ username: req.body.username });
    
    console.log('User found:', user ? user.username : 'NOT FOUND');
    
    if (!user) return res.status(401).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user instanceof Doctor ? 'doctor' : 'patient' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Store token in user's tokens array (
    user.tokens = user.tokens.concat({ token });
    await user.save();

    // Send successful response
    res.status(200).json({ 
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user instanceof Doctor ? 'doctor' : 'patient'
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});


// OpenAI API Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Diagnosis Endpoint
app.post('/api/diagnose', async (req, res) => {
    const patientInfo = req.body.patientInfo;

    if (!patientInfo) {
        return res.status(400).json({ error: 'Patient info is required' });
    }

    try {
        const prompt = `Patient Info:
- Age: ${patientInfo.age}
- Weight: ${patientInfo.weight}
- Symptoms: ${patientInfo.symptoms}
- Vital Signs: ${patientInfo.vitalSigns}
- Medical History: ${patientInfo.medicalHistory}
- Physical Examination: ${patientInfo.physicalExamination}

Based on the above information, provide the top 5 possible diagnoses.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: 'You are a medical assistant. Provide accurate and concise diagnoses based on the patient information. Limit the response to 200 words' },
                { role: 'user', content: prompt },
            ],
            max_tokens: 250,
        });

        const diagnoses = completion.choices[0].message.content;
        res.status(200).json({ diagnoses });
    } catch (error) {
        console.error('OpenAI Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch diagnoses. Please try again.' });
    }
});


app.post('/api/patient-insights', authMiddleware, async (req, res) => {
    if (req.role !== 'patient') return res.status(403).json({ error: 'Forbidden' });
  
    try {
      const { medications, diagnosis, symptoms } = req.body;
      
      const prompt = `As a medical assistant, provide concise insights for a patient with:
- Diagnosis: ${diagnosis || 'Not specified'}
- Medications: ${medications.map(m => m.name).join(', ') || 'None'}
- Symptoms: ${symptoms.join(', ') || 'None'}

Provide this information in a clear, spaced format with these sections:
1. Condition Summary: (1-2 sentences)
2. Key Points: (3-4 bullet points)
3. When to Seek Help: (clear signs to watch for)
4. Wellness Tips: (2-3 suggestions)

Keep response under 250 words total. Use simple language and empathic tone `;
  
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a compassionate medical assistant. Provide clear, accurate information without alarming the patient.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 350
      });
  
      res.json({ insights: completion.choices[0].message.content });
    } catch (err) {
      console.error('AI insights error:', err);
      res.status(500).json({ error: 'Failed to generate insights' });
    }
  });
  
  app.post('/api/patient-chat', authMiddleware, async (req, res) => {
    if (req.role !== 'patient') return res.status(403).json({ error: 'Forbidden' });
  
    try {
      const { message, context } = req.body;
      
      const prompt = `Patient asks: "${message}"
      
  Their medical context:
  - Diagnosis: ${context.diagnosis || 'Unknown'}
  - Medications: ${context.medications.map(m => m.name).join(', ') || 'None'}
  - Symptoms: ${context.symptoms.join(', ') || 'None'}
  
  Provide a helpful response (150-200 words) that:
  1. Answers the question simply
  2. References their medical context if relevant
  3. States clearly if they should contact their doctor
  4. Uses empathetic, reassuring tone`;
  
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a patient medical assistant. Provide helpful information without diagnosis or treatment advice.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 250
      });
  
      res.json({ response: completion.choices[0].message.content });
    } catch (err) {
      console.error('AI chat error:', err);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });


// Static files and catch-all route
app.use(express.static(path.join(__dirname, 'dist')));

// Redirect root to /login
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error('An internal error occurred:', err.stack);
    res.status(500).json({ error: 'An internal error occurred. Please try again later.' });
});

// Database connection and server startup
connectToDb()
    .then(() => {
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });