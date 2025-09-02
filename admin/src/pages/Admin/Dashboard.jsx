import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets';
import Swal from 'sweetalert2';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { dashData, getDashData, aToken, backendUrl } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) getDashData();
  }, [aToken]);

  const handleCancel = async (appointmentId) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel this appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
    });

    if (confirm.isConfirmed) {
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/admin/cancel-appointment`,
          { appointmentId },
          { headers: { token: aToken } }
        );

        if (data.success) {
          toast.success('Appointment cancelled successfully');
          getDashData();
        } else {
          toast.error(data.message || 'Cancellation failed');
        }
      } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.message || 'Error cancelling appointment');
      }
    }
  };

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3 mb-10'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-16' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-16' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-16' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.users}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white max-w-[650px] border rounded-t'>
        <div className='flex items-center gap-2.5 p-4 border-b'>
          <img src={assets.list_icon} alt="" />
          <p className='font-medium'>Latest Bookings</p>
        </div>

        <div className='max-h-64 overflow-y-scroll'>
          {
            dashData.latestAppointments.map((item, index) => (
              <div key={index} className='flex items-center justify-between px-6 py-3 gap-3 hover:bg-gray-100'>
                <div className='flex items-center gap-3'>
                  <img className='w-10 rounded-full bg-gray-200' src={item.docData.image} alt="" />
                  <div className='text-sm'>
                    <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                    <p className='text-gray-600'>{item.slotDate} <span className='text-gray-800'>|</span> {item.slotTime}</p>
                  </div>
                </div>
                {
                  item.isCompleted
                    ? <p className='text-green-500 text-sm font-medium'>Completed</p>
                    : item.payment
                      ? ""
                      : <img
                        onClick={() => handleCancel(item._id)}
                        className='w-10 cursor-pointer rounded-full hover:scale-105 transition-transform'
                        src={assets.cancel_icon}
                        alt="Cancel"
                      />
                }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
