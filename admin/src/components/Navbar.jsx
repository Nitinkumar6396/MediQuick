import React, { useContext, useEffect } from 'react'
import logo  from '../assets/logo.svg'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { doctorContext } from '../context/DoctorContext'
import * as jwt_decode from "jwt-decode";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext)
  const navigate = useNavigate()
  const {state, setState} = useContext(AppContext)
  const {dToken, setDToken} = useContext(doctorContext)


  useEffect(()=>{
      if(aToken && jwt_decode.jwtDecode(aToken).role === 'Admin'){
        setState('Admin')
      }
      else if(dToken) setState('Doctor')
    },[aToken])

  const logout = () => {
    localStorage.removeItem('aToken')
    setAToken('')
    setDToken('')
    localStorage.removeItem('dToken')
    navigate('/')
  }

  return (
    <div className='flex justify-between items-center sm:px-10 py-1 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img onClick={() => navigate('/')} className="w-40 sm:w-44 cursor-pointer" src={logo} alt="logo" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>
          {state}
        </p>
      </div>

      {(aToken || dToken) && (
        <button
          onClick={logout}
          className='bg-primary text-white text-sm px-4 sm:px-10 py-2 rounded-full'
        >
          Logout
        </button>
      )}
    </div>
  )
}

export default Navbar
