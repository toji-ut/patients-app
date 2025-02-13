import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import TestChat from './pages/TestChat';
import PatientBoard from './pages/PatientBoard';
import DoctorDashboard from './pages/DoctorDashboard';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/test" element={<TestChat />} />
                <Route path="/patient" element={<PatientBoard />} />
                <Route path="/doctor" element={<DoctorDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

