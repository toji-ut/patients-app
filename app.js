const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config(); 
const { connectToDb, getDb } = require('./db');


const User= require('./models/user');

// Express app
const app = express();

// Middleware to log the request method and path
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Using morgan for logging
app.use(morgan('dev'));

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());  //  Allow frontend requests

// Connect to MongoDB
let db;
connectToDb((err) => {
    if (!err) {
        db = getDb();
        console.log(' Connected to MongoDB');
        // Start Server after DB connection is established
        const PORT = 3000; 
        app.listen(PORT, () => {
            console.log(` Server running on http://localhost:${PORT}`);
        });
    } else {
        console.error(' MongoDB Connection Error:', err);
    }
})

app.get('/users', (req, res) => {
    let users = []

    db.collection('users')
    .find()
    .forEach(user => users.push(user))
    .then(() => {
        res.status(200). json(users)
    })
    .catch(() => {
        res.status(500).json({error: 'Could not fecth documents'})
    })
});

// Login Endpoint



// OpenAI API Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, //  Uses .env key
});

// Diagnosis Endpoint
app.post('/api/diagnose', async (req, res) => {
    const patientInfo = req.body.patientInfo;

    if (!patientInfo) {
        return res.status(400).json({ error: 'Patient info is required' });
    }

    try {
        const completion = await openai.chat.completions.create({ 
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a medical assistant. Based on symptoms, provide the top 5 diagnoses.' },
                { role: 'user', content: `Patient Info: ${patientInfo}. Give 5 possible diagnoses.` },
            ],
            max_tokens: 300,
        });

        const diagnoses = completion.choices[0].message.content;
        res.status(200).json({ diagnoses });
    } catch (error) {
        console.error('OpenAI Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch diagnoses. Please try again.' });
    }
});

// Middleware for serving static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// Route for serving the main index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error('An internal error occurred:', err.stack);
    res.status(500).json({ error: 'An internal error occurred. Please try again later.' });
});
