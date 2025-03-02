import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Import components
import Header from './Frontend/Header';
import Footer from './Frontend/Footer';
import Home from './Frontend/Home';
import DoctorForm from './Frontend/DoctorForm';
import ProtectRoute from './Frontend/auth/Protectroute';
import AppointmentForm from './Frontend/AppointmentForm';
import AppointmentHandle from './Frontend/AppointmentHandle';
import Appointments from './Frontend/Appointments';


function App() {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth0();
  


  
  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 2000);
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="loader-container">
  //       <img src="https://basd.primarycareexchange.com/Content/Images/loading.gif" alt="Loading..." className="loader-gif" />
  //     </div>
  //   );
  // }

  return (
  
      <Router>
           <div className="app-container">
           <div className="content-wrapper">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
            
  <Route path="/book-appointment" element={<AppointmentForm />} />
  <Route path="/appointments" element={<Appointments />} />
             



              {/* Admin Routes */}
              <Route path="/doctor-form" element={<ProtectRoute allowedRoles={['Admin']}><DoctorForm /> </ProtectRoute> } />
              <Route path="/appointment-handle" element={<ProtectRoute allowedRoles={['Admin']}><AppointmentHandle/> </ProtectRoute> } />

              {/* Add more routes with role-based protection */}
              {/* <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} /> */}
              {/* <Route path="/user-profile" element={<ProtectedRoute allowedRoles={['user']}><UserProfile /></ProtectedRoute>} /> */}
            </Routes>
          </main>
          <Footer />
        </div>
        </div>
      </Router>
  );
}

export default App;
