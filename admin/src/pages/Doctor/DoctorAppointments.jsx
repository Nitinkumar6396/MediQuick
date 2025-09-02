import React from 'react'
import { useContext } from 'react'
import { doctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import Swal from 'sweetalert2'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, backendUrl } = useContext(doctorContext)
  const { calculateAge } = useContext(AppContext)

  useEffect(() => {
    if (dToken) getAppointments()
  }, [dToken])


  const handleCompleted = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { token: dToken } })

      if (data.success) {
        toast.success(data.message)
        getAppointments()
      }
      else toast.error(data.message)
    }
    catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }


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
            `${backendUrl}/api/doctor/cancel-appointment`,
            { appointmentId },
            { headers: { token: dToken } }
          )

          if (data.success) {
            toast.success('Appointment cancelled successfully')
            getAppointments()
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
    <div className='w-full max-w-6xl m-5'>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_2.5fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {
          appointments.length > 0 && appointments.map((item, index) => (
            <div key={index} className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2.5fr_1fr_1fr] gap-1 items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-100'>

              <p className='max-sm:hidden'>{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-6 sm:w-10 rounded-full bg-gray-200' src={item.userData.image} alt="" />
                <p>{item.userData.name}</p>
              </div>
              <p className='text-xs border w-fit border-primary px-2 rounded-full'>{item.payment ? "Online" : "CASH"}</p>
              <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
              <p>
                {item.slotDate} <span className='text-gray-800'>|</span> {item.slotTime}
              </p>

              <p>{item.docData.fees}</p>

              {
                item.isCompleted
                  ? <p className='text-green-500 text-sm font-medium'>Completed</p>
                  : item.payment
                    ? <img
                      onClick={() => handleCompleted(item._id)}
                      className='w-10 cursor-pointer rounded-full hover:scale-105 transition-transform'
                      src={assets.tick_icon}
                      alt="complete"
                    />
                    : <div className='flex'>
                      <img
                        onClick={() => handleCancel(item._id)}
                        className='w-10 cursor-pointer rounded-full hover:scale-105 transition-transform'
                        src={assets.cancel_icon}
                        alt="Cancel"
                      />
                      <img
                        onClick={() => handleCompleted(item._id)}
                        className='w-10 cursor-pointer rounded-full hover:scale-105 transition-transform'
                        src={assets.tick_icon}
                        alt="complete"
                      />
                    </div>
              }

            </div>
          ))
        }
      </div>

    </div>
  )
}

export default DoctorAppointments