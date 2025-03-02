// AppointmentHandle.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaUserMd, FaClock, FaNotesMedical, FaCheckCircle, FaTimesCircle, FaPencilAlt } from 'react-icons/fa';
import '../style/AppointmentHandle.css';

const AppointmentHandle = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('http://localhost:5000/appointments');
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleUpdate = async (id, status) => {
    const adminDescription = prompt('Add a description (optional)') || '';
  
    try {
      const { data } = await axios.put(`http://localhost:5000/appointment/${id}`, {
        status,
        adminDescription,
      });
  
      setAppointments((appointments) =>
        appointments.map((app) =>
          app._id === id ? { ...app, status, adminDescription } : app
        )
      );
  
      alert(data.message);
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment');
    }
  };

  return (
    <div className="container-fluidss">
      <h2 className="appointment-title">Appointments</h2>
      
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="appointment-table-container">
          <table className="appointment-table">
            <thead>
              <tr>
                <th><FaUser /> Patient</th>
                <th><FaUserMd /> Doctor</th>
                <th><FaClock /> Time</th>
                <th><FaNotesMedical /> Reason</th>
                <th>Status</th>
                <th><FaPencilAlt /> Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr className="no-appointments-row">
                  <td colSpan="7" className="no-appointments-text">
                    No appointments available
                  </td>
                </tr>
              ) : (
                appointments?.map(app => (
                  <tr key={app._id || Math.random()} className="appointment-row">
                    <td>{app?.patientName || 'Unknown Patient'}</td>
                    <td>{app?.doctor?.name || 'Unknown Doctor'}</td>
                    <td>{app?.appointmentTime ? new Date(app.appointmentTime).toLocaleString() : 'N/A'}</td>
                    <td>{app?.reason || 'No reason provided'}</td>
                    <td>
                      <span className={`status-badge status-${app?.status || 'unknown'}`}>
                        {app?.status || 'Unknown'}
                      </span>
                    </td>
                    <td>{app?.adminDescription || 'N/A'}</td>
                    <td>
                      {app?.status === 'pending' ? (
                        <div className="action-buttons">
                          <button 
                            className="btn btn-accept"
                            onClick={() => handleUpdate(app._id, 'accepted')}
                          >
                            <FaCheckCircle /> Accept
                          </button>
                          <button 
                            className="btn btn-reject"
                            onClick={() => handleUpdate(app._id, 'rejected')}
                          >
                            <FaTimesCircle /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className='text-danger'>Not Applicable</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentHandle;
