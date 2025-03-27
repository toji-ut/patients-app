// Import required libraries
const jwt = require('jsonwebtoken');
const Doctor = require('./models/doctor');
const Patient = require('./models/patient');


const authMiddleware = async (req, res, next) => {
  
  const authHeader = req.header('Authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;

  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Please log in to access this page' 
    });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    let user;
    if (decoded.role === 'doctor') {
      user = await Doctor.findById(decoded.userId);
    } else if (decoded.role === 'patient') {
      user = await Patient.findById(decoded.userId);
    }

    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    
    req.user = user;       
    req.token = token;    
    req.role = decoded.role; 

   
    next();
    
  } catch (error) {
    
    return res.status(401).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }
};


module.exports = authMiddleware;