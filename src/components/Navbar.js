import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userType }) => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {userType === 'user' && (
          <>
            <li><Link to="/user/dashboard">Dashboard</Link></li>
            <li><Link to="/user/diet-plans">Diet Plans</Link></li>
            <li><Link to="/user/book-appointment">Book Appointment</Link></li>
            <li><Link to="/user/profile">Profile</Link></li>
          </>
        )}
        {userType === 'dietician' && (
          <>
            <li><Link to="/dietician/dashboard">Dashboard</Link></li>
            <li><Link to="/dietician/manage-diet-plans">Manage Diet Plans</Link></li>
            <li><Link to="/dietician/view-appointments">View Appointments</Link></li>
            <li><Link to="/dietician/profile">Profile</Link></li>
          </>
        )}
        {userType === 'admin' && (
          <>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/manage-users">Manage Users</Link></li>
            <li><Link to="/admin/manage-dieticians">Manage Dieticians</Link></li>
            <li><Link to="/admin/view-appointments">View All Appointments</Link></li>
          </>
        )}
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
