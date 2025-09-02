import express from 'express'
import { getAllDoctors } from '../controllers/adminControllers.js'
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctorDashboard, doctorProfile, loginDoctor, updateProfile } from '../controllers/doctorControllers.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list',getAllDoctors)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete)
doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancel)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.post('/update-profile',authDoctor,updateProfile)

export default doctorRouter