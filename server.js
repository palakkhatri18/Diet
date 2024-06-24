const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Add this line
app.use(bodyParser.json());

// MongoDB models
const User = mongoose.model('User', new mongoose.Schema({ name: String, email: String, role: String }));
const Dietician = mongoose.model('Dietician', new mongoose.Schema({ name: String, email: String, verified: Boolean }));
const Appointment = mongoose.model('Appointment', new mongoose.Schema({ userId: String, dieticianId: String, date: Date, googleMeetLink: String }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Google API setup
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

const createGoogleMeetLink = async () => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const event = {
    summary: 'Dietician Appointment',
    start: {
      dateTime: '2024-06-28T09:00:00-07:00',
      timeZone: 'America/Los_Angeles',
    },
    end: {
      dateTime: '2024-06-28T09:30:00-07:00',
      timeZone: 'America/Los_Angeles',
    },
    conferenceData: {
      createRequest: {
        requestId: 'sample123',
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1,
  });

  return response.data.hangoutLink;
};

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.YOUR_EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: process.env.ACCESS_TOKEN,
    },
  });

  const mailOptions = {
    from: process.env.YOUR_EMAIL,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

// Admin verification of dieticians
app.post('/api/admin/verify-dietician', async (req, res) => {
  const { dieticianId } = req.body;
  await Dietician.findByIdAndUpdate(dieticianId, { verified: true });
  res.sendStatus(200);
});

// Get verified dieticians
app.get('/api/verified-dieticians', async (req, res) => {
  const dieticians = await Dietician.find({ verified: true });
  res.json(dieticians);
});

// Book appointment
app.post('/api/book-appointment', async (req, res) => {
  const { userId, dieticianId, date } = req.body;
  const googleMeetLink = await createGoogleMeetLink();
  
  const appointment = new Appointment({ userId, dieticianId, date, googleMeetLink });
  await appointment.save();

  const user = await User.findById(userId);
  const dietician = await Dietician.findById(dieticianId);

  await sendEmail(user.email, 'Your Counseling Session', `Your session is scheduled. Join here: ${googleMeetLink}`);
  await sendEmail(dietician.email, 'New Counseling Session', `A new session is scheduled. Join here: ${googleMeetLink}`);

  res.json(appointment);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
