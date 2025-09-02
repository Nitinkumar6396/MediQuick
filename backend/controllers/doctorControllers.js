import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;

        if (!docId) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID is required"
            });
        }

        const docData = await doctorModel.findById(docId);
        if (!docData) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });

        return res.status(200).json({
            success: true,
            message: "Availability changed"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// doctor login API
const loginDoctor = async (req,res) => {
    try {
        
        const {email,password} = req.body
        const doctor = await doctorModel.findOne({email})

        if(!doctor){
            return res.json({
                success:false,
                message:"Invalid email"
            })
        }

        const isMatch = await bcrypt.compare(password,doctor.password)
        if(isMatch){
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            return res.json({
                success:true,
                message:"Token generated successfully",
                token
            })
        }
        else{
            return res.json({
                success:false,
                message:"Invalid email or password"
            })
        }

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


// API to get all appointments
const appointmentsDoctor = async(req,res) => {
    try{

        const docId = req.doctor.id
        const appointments = await appointmentModel.find({docId})

        return res.json({
            success:true,
            message:"appointments fetched successfully",
            appointments
        })

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


//API to complete appointment
const appointmentComplete = async (req,res) => {
    try{

        const {appointmentId} = req.body
        const docId = req.doctor.id

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({
                success: false,
                message: "Appointment not found"
            });
        }

        if (appointment.docId.toString() !== docId) {
            return res.json({
                success: false,
                message: "Unauthorized: You cann't mark completed this appointment"
            });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})

        return res.json({
            success: true,
            message: "Appointment completed"
        })

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


//API to cancel appointment
const appointmentCancel = async (req,res) => {
    try{

        const { appointmentId} = req.body
        const docId = req.doctor.id
        const appointment = await appointmentModel.findById(appointmentId)
        if(appointment && appointment.docId === docId){
            await appointmentModel.findByIdAndDelete(appointmentId)
            return res.json({
                success:true,
                message:"Appointment cancelled"
            })
        }
        else{
            return res.json({
                success:false,
                message:"Cancellation failed"
            })
        }

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


// API for doctor dashboard data
const doctorDashboard = async (req,res) => {
    try{
        const docId = req.doctor.id
        const appointments = await appointmentModel.find({docId})
        const patients = []
        appointments.map((item) => {
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        let earning = 0
        appointments.map((item) => {
            if(item.isCompleted || item.payment){
                earning += item.amount
            }
        })

        const dashData = {
            earning,
            patients:patients.length,
            appointments:appointments.length,
            latestAppointment: appointments.reverse().slice(0,5)
        }

        return res.json({
            success:true,
            dashData
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


// API to get profile data
const doctorProfile = async (req,res) => {
    try{

        const docId = req.doctor.id
        const doctorData = await doctorModel.findById(docId)
        if(doctorData){
            return res.json({
                success:true,
                doctorData
            })
        }
        else{
            return res.json({
                success:false,
                message:"Error occured while fetching doctor profile data"
            })
        }

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


// API to updata doctot profile data
const updateProfile = async (req,res) => {
    try{
        const docId = req.doctor.id
        const {fees,address,available} = req.body

        const updatedProfile = await doctorModel.findByIdAndUpdate(docId,{fees,available,address})
        return res.json({
            success:true,
            message:"Profile data updated",
            updatedProfile
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export {changeAvailability, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateProfile }
