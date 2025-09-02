import React, { useContext, useEffect } from 'react'
import { doctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import Swal from 'sweetalert2'

const DoctorDashboard = () => {
  const { dashData, setDashData, getDashData, dToken, cancelAppointment } = useContext(doctorContext)

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken])

  // Cancel Handler
  const handleCancel = async (appointmentId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to cancel this appointment?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it'
    });

    if (result.isConfirmed) {
      const success = await cancelAppointment(appointmentId);
      if (success) {
        Swal.fire('Cancelled!', 'Appointment has been cancelled.', 'success');
        getDashData();
      }
    }
  };

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3 mb-10'>
        {/* Earnings */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-16' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.earning}</p>
            <p className='text-gray-400'>Earnings</p>
          </div>
        </div>

        {/* Appointments */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-16' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        {/* Patients */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-16' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className='bg-white max-w-[650px] border rounded-t'>
        <div className='flex items-center gap-2.5 p-4 border-b'>
          <img src={assets.list_icon} alt="" />
          <p className='font-medium'>Latest Bookings</p>
        </div>

        <div className='max-h-64 overflow-y-scroll'>
          {
            dashData.latestAppointment?.length > 0 && dashData.latestAppointment.map((item, index) => (
              <div key={index} className='flex items-center justify-between px-6 py-3 gap-3 hover:bg-gray-100'>
                <div className='flex items-center gap-3'>
                  <img className='w-10 rounded-full bg-gray-200' src={item.userData.image} alt="" />
                  <div className='text-sm'>
                    <p className='text-gray-800 font-medium'>{item.userData.name}</p>
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
  )
}

export default DoctorDashboard
