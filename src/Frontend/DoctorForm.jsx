// DoctorForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/DoctorForm.css';
import { FaUserMd, FaStethoscope, FaEnvelope, FaPhone, FaCalendar, FaClock, FaEdit, FaTrash } from 'react-icons/fa';

const DoctorForm = () => {
  const [doctor, setDoctor] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    availableDays: [],
    availableTime: '',
  });

  const [doctors, setDoctors] = useState([]);
  const [editingDoctorId, setEditingDoctorId] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value });
  };

  const handleCheckbox = (day) => {
    const updatedDays = doctor.availableDays.includes(day)
      ? doctor.availableDays.filter(d => d !== day)
      : [...doctor.availableDays, day];
    setDoctor({ ...doctor, availableDays: updatedDays });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctorId) {
        await axios.put(`http://localhost:5000/api/doctors/${editingDoctorId}`, doctor);
        alert('Doctor updated successfully');
        setEditingDoctorId(null);
      } else {
        await axios.post('http://localhost:5000/api/doctors/add', doctor);
        alert('Doctor added successfully');
      }
      fetchDoctors();
      setDoctor({ name: '', specialization: '', email: '', phone: '', availableDays: [], availableTime: '' });
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  const handleEdit = (doc) => {
    setDoctor(doc);
    setEditingDoctorId(doc._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await axios.delete(`http://localhost:5000/api/doctors/${id}`);
        alert('Doctor deleted successfully');
        fetchDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="container-fluids">
      <div className="row">
        {/* Left Column - Doctor Form */}
        <div className="col-md-6 p-4">
          <div className="doctor-form animate__animated animate__fadeIn">
            <h2 className="text-center mb-4">
              {editingDoctorId ? 'Edit Doctor' : 'Add Doctor'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 input-group">
                <span className="input-group-text"><FaUserMd /></span>
                <input type="text" name="name" className="form-control" placeholder="Doctor's Name" value={doctor.name} onChange={handleChange} required />
              </div>

              <div className="mb-3 input-group">
                <span className="input-group-text"><FaStethoscope /></span>
                <input type="text" name="specialization" className="form-control" placeholder="Specialization" value={doctor.specialization} onChange={handleChange} required />
              </div>

              <div className="mb-3 input-group">
                <span className="input-group-text"><FaEnvelope /></span>
                <input type="email" name="email" className="form-control" placeholder="Email" value={doctor.email} onChange={handleChange} required />
              </div>

              <div className="mb-3 input-group">
                <span className="input-group-text"><FaPhone /></span>
                <input type="text" name="phone" className="form-control" placeholder="Phone Number" value={doctor.phone} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label"><FaCalendar /> Available Days</label>
                <div className="d-flex flex-wrap">
                  {days.map(day => (
                    <div key={day} className="form-check me-3 animate__animated animate__fadeIn">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        value={day}
                        checked={doctor.availableDays.includes(day)}
                        onChange={() => handleCheckbox(day)}
                      />
                      <label className="form-check-label">{day}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3 input-group">
                <span className="input-group-text"><FaClock /></span>
                <input type="text" name="availableTime" className="form-control" placeholder="e.g., 10:00 AM - 3:00 PM" value={doctor.availableTime} onChange={handleChange} required />
              </div>

              <button type="submit" className="btn btn-primary w-100 animate__animated animate__pulse">
                {editingDoctorId ? 'Update Doctor' : 'Add Doctor'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Doctors List */}
        <div className="col-md-6 p-4">
          <div className="doctors-list-container animate__animated animate__fadeIn">
            <h2 className="text-center mb-4">Doctors List</h2>
            <ul className="list-group">
              {doctors.map(doc => (
                <li key={doc._id} className="list-group-item animate__animated animate__fadeInUp">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5><FaUserMd className="me-2" /> {doc.name} <span className="specialization">({doc.specialization})</span></h5>
                      <p><FaEnvelope className="me-2" /> {doc.email} | <FaPhone className="me-2" /> {doc.phone}</p>
                      <small><FaCalendar className="me-2" /> {doc.availableDays.join(', ')} | <FaClock className="me-2" /> {doc.availableTime}</small>
                    </div>
                    <div className="d-flex gap-3">
                      <button className="btn btn-warning btn-sm" onClick={() => handleEdit(doc)}><FaEdit /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(doc._id)}><FaTrash /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorForm;