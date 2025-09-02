import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AdminContext } from './context/AdminContext';
import { AppContext } from './context/AppContext';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import AllDoctors from './pages/Admin/AllDoctors';
import Login from './pages/Login'
import { doctorContext } from './context/DoctorContext';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';

const App = () => {
  const { aToken } = useContext(AdminContext);
  const {dToken} = useContext(doctorContext)

  return (
    <div className='h-screen flex flex-col'>
      <Navbar/>
      {aToken || dToken ? (
        <div className="bg-[#F8F9FD] flex flex-1">
          <Sidebar />
          <main className="">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* <Route path="/admin-dashboard" element={<Dashboard />} /> */}
              <Route path="/all-appointments" element={<AllAppointments />} />
              <Route path="/add-doctor" element={<AddDoctor />} />
              <Route path="/doctor-list" element={<AllDoctors />} />

              <Route path='/doctor-appointments' element={<DoctorAppointments/>} />
              <Route path='/doctor-profile' element={<DoctorProfile/>} />
              <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />
            </Routes>
          </main>
        </div>
      ) : (
        <Login />
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
