import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import UserDashboard from './pages/user/UserDashboard';
import DietPlans from './pages/user/DietPlans';
import BookAppointment from './pages/user/BookAppointment';
import UserProfile from './pages/user/UserProfile';
import DieticianDashboard from './pages/dietician/DieticianDashboard';
import ManageDietPlans from './pages/dietician/ManageDietPlans';
import ViewAppointments from './pages/dietician/ViewAppointments';
import DieticianProfile from './pages/dietician/DieticianProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDieticians from './pages/admin/ManageDieticians';
import ViewAllAppointments from './pages/admin/ViewAllAppointments';
import VerifyDieticians from './pages/admin/VerifyDieticians';

function App() {
  const [userType, setUserType] = useState('user'); // Set to 'user', 'dietician', or 'admin'
  return (
    <Router>
      <Navbar userType={userType} />
      <Routes>
        <Route path="/" element={<Home />} />
        {userType === 'user' && (
          <>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/diet-plans" element={<DietPlans />} />
            <Route path="/user/book-appointment" element={<BookAppointment />} />
            <Route path="/user/profile" element={<UserProfile />} />
          </>
        )}
        {userType === 'dietician' && (
          <>
            <Route path="/dietician/dashboard" element={<DieticianDashboard />} />
            <Route path="/dietician/manage-diet-plans" element={<ManageDietPlans />} />
            <Route path="/dietician/view-appointments" element={<ViewAppointments />} />
            <Route path="/dietician/profile" element={<DieticianProfile />} />
          </>
        )}
        {userType === 'admin' && (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
            <Route path="/admin/manage-dieticians" element={<ManageDieticians />} />
            <Route path="/admin/view-appointments" element={<ViewAllAppointments />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
