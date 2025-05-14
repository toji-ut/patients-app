import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PatientBoard from './pages/PatientBoard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientsList from './pages/PatientsList';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/patient" element={<PatientBoard />} />
                <Route path="/doctor" element={<DoctorDashboard />} />
                <Route path="/patient/:id" element={<PatientBoard />} />
                <Route path="/patients" element={<PatientsList />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

