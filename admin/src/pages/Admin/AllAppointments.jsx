import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import Swal from 'sweetalert2'
import axios from 'axios'
import { toast } from 'react-toastify'

const AllAppointments = () => {
  const { appointments, getAllAppointments, aToken, backendUrl } = useContext(AdminContext)
  const { calculateAge, currency } = useContext(AppContext)
  const { showSidebar, setShowSidebar } = useContext(AppContext)


  useEffect(() => {
    if (aToken) getAllAppointments()
  }, [aToken])

  const handleCancel = (appointmentId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to cancel this appointment.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/admin/cancel-appointment`,
            { appointmentId },
            { headers: { token: aToken } }
          )

          if (data.success) {
            toast.success('Appointment cancelled successfully')
            getAllAppointments()
          } else {
            toast.error(data.message)
          }
        } catch (error) {
          console.error(error)
          toast.error(error.response?.data?.message || "Something went wrong")
        }
      }
    })
  }

  return (
    <div className={`max-w-6xl m-5 ${showSidebar ? "hidden" : ""}`}>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm '>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        <div className='max-h-[65vh] min-h-[55vh] overflow-y-scroll'>
          {appointments.map((item, index) => (
            <div
              key={index}
              className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 px-6 py-3 border-b hover:bg-gray-100'
            >
              <p className='max-sm:hidden'>{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-6 sm:w-10 rounded-full bg-gray-200' src={item.userData.image} alt="" />
                <p>{item.userData.name}</p>
              </div>
              <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
              <p>
                {item.slotDate} <span className='text-gray-800'>|</span> {item.slotTime}
              </p>
              <div className='flex items-center gap-2'>
                <img className='w-6 sm:w-10 rounded-full bg-gray-200' src={item.docData.image} alt="" />
                <p>{item.docData.name}</p>
              </div>
              <p>{currency}{item.docData.fees}</p>

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
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllAppointments
