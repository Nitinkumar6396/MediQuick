import express from 'express'
import {addDoctor, adminDashboard, appointmentAdmin, cancelAppointment, getAllDoctors, login} from '../controllers/adminControllers.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/doctorControllers.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',login)
adminRouter.get('/all-doctors',authAdmin,getAllDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
adminRouter.get('/appointments',authAdmin,appointmentAdmin)
adminRouter.get('/dashboard',authAdmin,adminDashboard)
adminRouter.post('/cancel-appointment',authAdmin,cancelAppointment)


export default adminRouter