require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { expressjwt: checkJwt } = require('express-jwt');
const nodemailer = require('nodemailer');


const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Define User Schema
const UserSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  picture: String,
  role: { type: String, default: 'user' }, // Add role with 'user' as default
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);



const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  availableDays: { type: [String], required: true }, // ["Monday", "Wednesday"]
  availableTime: { type: String, required: true }, // "10:00 AM - 3:00 PM"
  appointment_status: { type: String, default: 'free' } // 'free' or 'appointed'
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);


const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  contact: { type: String, required: true },
  email: {type: String, required: true},
  reason: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  appointmentTime: { type: Date, required: true },
  adminDescription: {type: String},
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'], // Allowed options
    default: 'pending' // Default value
  },
userId: { type: String, required: true }

});

const Appointment = mongoose.model('Appointment', appointmentSchema);



// Auth0 Middleware
const checkAuth = checkJwt({
  secret: process.env.AUTH0_SECRET,
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

// Role-based Access Middleware
const checkRole = (role) => (req, res, next) => {
  const roles = req.auth['https://yourapp.com/roles'] || []; 
  if (roles.includes(role)) {
    return next();
  }
  return res.status(403).json({ message: '🚫 Access forbidden: insufficient role' });
};

// Register/Login User to MongoDB
app.post('/api/auth', async (req, res) => {
  try {
    const { auth0Id, name, email, picture, role } = req.body;

    let user = await User.findOne({ auth0Id });
    if (!user) {
      user = new User({ auth0Id, name, email, picture, role });
      await user.save();
    } else if (!user.role) { 
      // Optional: Update role if it's missing
      user.role = role;
      await user.save();
    }

    res.status(200).json({ message: 'User authenticated', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Admin-only Route
app.get('/api/admin', checkAuth, checkRole('admin'), (req, res) => {
  res.json({ message: '👋 Welcome, Admin! You have full access.' });
});

// User-only Route
app.get('/api/user', checkAuth, checkRole('user'), (req, res) => {
  res.json({ message: '👋 Welcome, User! You have limited access.' });
});


app.post('/api/doctors/add', async (req, res) => {
  try {
    const newDoctor = new Doctor(req.body);
    await newDoctor.save();
    res.status(201).json({ message: 'Doctor added successfully', doctor: newDoctor });
  } catch (error) {
    res.status(500).json({ message: 'Error adding doctor', error });
  }
});

// Get All Doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
});

// Update Doctor
app.put('/api/doctors/:id', async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(updatedDoctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ message: 'Error updating doctor', error });
  }
});


// Delete Doctor
app.delete('/api/doctors/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor', error });
  }
});



// app.get('/doctors', async (req, res) => {
//   try {
//     const doctors = await Doctor.find();
//     res.json(doctors);
//   } catch (error) {
//     res.status(500).send('Server error');
//   }
// });

// Book appointment
app.post('/book', async (req, res) => {
  const { patientName, contact, reason, doctorId, appointmentTime, email, status, authId } = req.body;

  try {
    const appointment = new Appointment({
      patientName,
      contact,
      reason,
      email,
      doctor: doctorId,
      appointmentTime,
      status,
      userId: authId
    });

    await appointment.save();

    await Doctor.findByIdAndUpdate(doctorId, { appointment_status: 'appointed' });

    res.status(201).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Auto-update doctor status when time passes
const updateDoctorStatus = async () => {
  const now = new Date();
  const pastAppointments = await Appointment.find({ appointmentTime: { $lt: now } });

  for (const appointment of pastAppointments) {
    await Doctor.findByIdAndUpdate(appointment.doctor, { appointment_status: 'free' });
    // await Appointment.findByIdAndDelete(appointment._id); // Optional cleanup
  }
};

// Run every 1 minute
setInterval(updateDoctorStatus, 60000);



app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctor');
    res.json(appointments);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Accept or reject appointment
const emailQueue = [];

app.put('/appointment/:id', async (req, res) => {
  const { status, adminDescription } = req.body;

  try {
    const appointment = await Appointment.findById(req.params.id).populate('doctor');

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.status === status) {
      return res.status(400).json({ message: 'Status is already up to date' });
    }

    const previousStatus = appointment.status;
    appointment.status = status;
    appointment.adminDescription = adminDescription;
    await appointment.save();

    console.log("Doctor mail", appointment.doctor.email);
    console.log("Patient main", appointment.email);

    // Immediate response — no waiting for emails
    res.json({ message: 'Appointment updated successfully' });

    // Only queue emails if the status changed
    if (status !== previousStatus) {
      emailQueue.push({
        patient: {
          email: appointment.email,
          name: appointment.patientName,
        },
        doctor: {
          email: appointment.doctor.email,
          name: appointment.doctor.name,
        },
        status,
        adminDescription,
        appointmentTime: appointment.appointmentTime,
        googleMeetLink: generateGoogleMeetLink(),
      });

      processEmailQueue();
    }
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error — update successful, emails not sent' });
  }
});

// Background email processor
async function processEmailQueue() {
  while (emailQueue.length > 0) {
    const job = emailQueue.shift();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dummymailjy@gmail.com',
        pass: 'bgfs wkwi vcsm viwt',
      },
      tls: { rejectUnauthorized: false },
    });

    const patientMail = {
      from: 'dummymailjy@gmail.com',
      to: job.patient.email,
      subject: `Appointment ${job.status === 'accepted' ? 'Confirmed' : 'Rejected'}`,
      text: `
        Hi ${job.patient.name},

        Your appointment has been ${job.status}.
        ${job.adminDescription ? `Note from Admin: ${job.adminDescription}` : ''}
        ${job.status === 'accepted' ? `Google Meet Link: ${job.googleMeetLink}` : ''}
      `,
    };

    const doctorMail = job.status === 'accepted' && {
      from: 'dummymailjy@gmail.com',
      to: job.doctor.email,
      subject: `New Appointment with ${job.patient.name}`,
      text: `
        Hi Dr. ${job.doctor.name},

        You have a confirmed appointment with ${job.patient.name} at ${job.appointmentTime}.
        Google Meet Link: ${job.googleMeetLink}
      `,
    };

    try {
      await transporter.sendMail(patientMail);
      if (doctorMail) await transporter.sendMail(doctorMail);
      console.log('Emails sent successfully');
    } catch (error) {
      console.error('Failed to send emails:', error);
    }
  }
}

// Function to generate a Google Meet Link (dummy example)
function generateGoogleMeetLink() {
  return `https://meet.google.com/${Math.random().toString(36).substring(7)}`;
}





app.get('/appointment/:auth0Id', async (req, res) => {
  const { auth0Id } = req.params;
  const decodedAuth0Id = decodeURIComponent(auth0Id);

  try {
    const appointments = await Appointment.find({ userId: decodedAuth0Id }).populate('doctor'); // Use userId here

    if (!appointments.length) {
      return res.status(404).json({ message: 'No appointments found for this user' });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
