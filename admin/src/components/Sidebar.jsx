import { useContext } from 'react'
import { FaUserMd, FaCalendarAlt, FaPlus, FaList, FaUser } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { doctorContext } from '../context/DoctorContext'

const Sidebar = () => {

  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(doctorContext)

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2 cursor-pointer px-2 py-2 rounded-md ${isActive ? 'text-primary bg-[#f0f0ff] font-semibold' : 'text-gray-700'
    }`

  return (
    <div className={`lg:w-64  bg-white border-r p-5`}>
      {
        aToken && <ul className='space-y-3 text-sm'>

          <li>
            <NavLink to="/" className={linkClasses}>
              <FaUserMd /> <span className='max-sm:hidden'>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/all-appointments" className={linkClasses}>
              <FaCalendarAlt /> <span className='max-sm:hidden'>Appointments</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/add-doctor" className={linkClasses}>
              <FaPlus /> <span className='max-sm:hidden'>Add Doctor</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/doctor-list" className={linkClasses}>
              <FaList /> <span className='max-sm:hidden'>Doctors List</span>
            </NavLink>
          </li>

        </ul>
      }
      {
        dToken && <ul className='space-y-3 text-sm'>

          <li>
            <NavLink to="/doctor-dashboard" className={linkClasses}>
              <FaUserMd /> <span className='max-sm:hidden'>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/doctor-appointments" className={linkClasses}>
              <FaCalendarAlt /> <span className='max-sm:hidden'>Appointments</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/doctor-profile" className={linkClasses}>
              <FaUser /> <span className='max-sm:hidden'>Profile</span>
            </NavLink>
          </li>

        </ul>
      }
    </div>
  )
}

export default Sidebar
