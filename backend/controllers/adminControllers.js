import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';

// Add Doctor API
const addDoctor = async (req, res) => {
    try {
        const {
            name, email, password,
            speciality, degree, experience,
            fees, about, address
        } = req.body;

        const imageFile = req.file;

        // Validate required fields
        if (!name || !email || !password || !speciality || !degree || !experience || !fees || !about || !address || !imageFile) {
            return res.status(400).json({
                success: false,
                data: {
                    name,
                    email,
                    password: password,
                    speciality,
                    degree,
                    experience,
                    fees,
                    about,
                    address: JSON.parse(address),
                    image: imageFile
                },
                message: "Please fill all the details and upload an image"
            });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        const existingDoctor = await doctorModel.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({
                success: false,
                message: "Email already exists. Please use a different email."
            });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image"
        });
        const imageUrl = imageUpload.secure_url;

        // Prepare doctor data
        const doctorData = {
            name,
            email,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            fees,
            about,
            address: JSON.parse(address),
            image: imageUrl
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        return res.status(200).json({
            success: true,
            message: "Doctor added successfully"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error occurred while adding the doctor",
            error: err.message
        });
    }
};

// Admin Login API
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Match admin credentials from .env
        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const payload = {
                email,
                role: "Admin"
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET);

            return res.status(200).json({
                success: true,
                token,
                message: "Token generated successfully"
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error occurred while generating token",
            error: err.message
        });
    }
};

//get all doctors
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find().select("-password"); // Exclude password for security

        return res.status(200).json({
            success: true,
            message: "Doctors fetched successfully",
            data: doctors,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error fetching doctors",
            error: err.message,
        });
    }
};


// get all apointment API
const appointmentAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({}).sort({date:-1})
        return res.json({
            success: true,
            message: "Appointment fetched successfully",
            appointments
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error fetching appointments (Admin)",
            error: err.message,
        });
    }
}


//admin dashboard API
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({}).sort({date:-1})

        const dashData = {
            doctors:doctors.length,
            users:users.length,
            appointments:appointments.length,
            latestAppointments:appointments.slice(0,5)
        }

        return res.json({
            success:true,
            message:"Dashboard data fetched",
            dashData
        })

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error fetching appointments (Admin)",
            error: err.message,
        });
    }
}

// cancell appointment API
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body

    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }

    const { docId, slotDate, slotTime} = appointment;

    await appointmentModel.findByIdAndDelete(appointmentId)
    await doctorModel.findByIdAndUpdate(
      { _id: docId },
      {
        $pull: {
          [`slots_booked.${slotDate}`]: slotTime
        }
      }
    )

    return res.json({
      success: true,
      message: "Appointment cancelled successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

export { addDoctor, login, getAllDoctors, appointmentAdmin, adminDashboard,cancelAppointment };
