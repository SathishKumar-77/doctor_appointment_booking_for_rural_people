import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { 
  FaUser, 
  FaPhone, 
  FaNotesMedical, 
  FaUserMd, 
  FaCalendarAlt,
  FaCheckCircle, 
  FaMailBulk
} from 'react-icons/fa';
import '../style/AppointmentForm.css';
import { useAuth0 } from '@auth0/auth0-react';

const AppointmentForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [authId, setAuthId] = useState("");
  const { isAuthenticated } = useAuth0();



  

  


  useEffect(() => {
    axios.get('http://localhost:5000/api/doctors')
      .then(res => {
    const storedSession = JSON.parse(sessionStorage.getItem('userSession'));
  
    setAuthId(storedSession.user.sub);
    setDoctors(res.data)})
      
      .catch(err => console.error(err));
  }, []);

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    // const status = "pending";
    try {
      await axios.post('http://localhost:5000/book', {
        patientName,
        contact,
        email,
        reason,
        doctorId,
        appointmentTime,
        authId
        
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
        setPatientName('');
        setContact('');
        setReason('');
        setDoctorId('');
        setAppointmentTime('');
      }, 2000);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed');
    }
  };

  return (
    <div className="rich-form-container">
      <div className="rich-form-card">
        <h2 className="rich-form-title">
          <FaCalendarAlt className="title-icon" /> Book Your Appointment
        </h2>
        
        <form onSubmit={handleSubmit} className="rich-form">
          <div className="rich-form-group">
            <FaUser className="rich-input-icon" />
            <input
              type="text"
              className="rich-form-input"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Patient Name"
              required
            />
          </div>

          <div className="rich-form-group">
            <FaPhone className="rich-input-icon" />
            <input
              type="text"
              className="rich-form-input"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Contact Number"
              required
            />
          </div>

          <div className="rich-form-group">
            <FaMailBulk className="rich-input-icon" />
            <input
              type="text"
              className="rich-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>

          <div className="rich-form-group">
            <FaNotesMedical className="rich-input-icon" />
            <input
              type="text"
              className="rich-form-input"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for Visit"
              required
            />
          </div>

          <div className="rich-form-group">
            <FaUserMd className="rich-input-icon" />
            <select
              className="rich-form-select"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
            >
              <option value="">Select a Doctor</option>
              {doctors
                .filter(doctor => doctor.appointment_status === 'free')
                .map(doctor => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.availableTime} ({doctor.specialization})
                  </option>
                ))}
            </select>
          </div>

          <div className="rich-form-group">
            <FaCalendarAlt className="rich-input-icon" />
            <input
              type="datetime-local"
              className="rich-form-input"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className={`rich-submit-btn ${isSubmitted ? 'submitted' : ''}`}
            disabled={isSubmitted}
          >
            {isSubmitted ? (
              <>
                <FaCheckCircle className="success-icon" /> Booked!
              </>
            ) : (
              'Book Appointment'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;