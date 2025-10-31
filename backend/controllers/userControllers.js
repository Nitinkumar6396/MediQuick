import validator from 'validator';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from "cloudinary";
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import Razorpay from 'razorpay'
import crypto from "crypto";
import transporter from '../config/nodemailer.js';
import otpGenerator from 'otp-generator'
import Otp from '../models/otpModel.js'

//Send OTP
const sendOtp = async (req, res) => {
  console.log('first')
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already registered" });
    }

    const otp = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, alphabets: false, upperCase: false, specialChars: false });

    await Otp.deleteMany({ email });

    const hashedOtp = await bcrypt.hash(otp, 10);
    await new Otp({ email, otp: hashedOtp }).save();

    // Send OTP email
    const mailOptions = {
      from: `MediQuick <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "OTP Verification - MediQuick",
      html: `
        <h2>MediQuick Email Verification</h2>
        <p>Your OTP for registration is: <b>${otp}</b></p>
        <p>This OTP will expire in 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};


// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP not found or expired" });
    }

    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP verified → delete OTP record
    await Otp.deleteMany({ email });

    // Now register the user (use your same logic)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    // Generate token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("OTP verify error:", error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      userData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    })
  }
}



// API: Update Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, dob, gender } = req.body;
    let { address } = req.body
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    try {
      if (typeof address === 'string') {
        address = JSON.parse(address);
      }
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid address format" });
    }

    const updatedFields = {
      name,
      phone,
      dob,
      gender,
      address: address || {}
    };

    await userModel.findByIdAndUpdate(userId, updatedFields);

    // Upload image if present
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image"
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`
    });
  }
};


// API for book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.user.id

    // Input validation
    if (!userId || !docId || !slotDate || !slotTime) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Fetch doctor and user
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData || !docData.available) {
      return res.json({
        success: false,
        message: "Doctor not available"
      });
    }

    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Check if slot already booked
    const bookedSlots = docData.slots_booked[slotDate] || [];
    if (bookedSlots.includes(slotTime)) {
      return res.json({
        success: false,
        message: "Slot already booked",
      });
    }

    // Save appointment
    const appointment = new appointmentModel({
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: docData.fees,
      date: Date.now(),
    });

    await appointment.save();

    // Update doctor's slot booking
    const updatedSlots = [...bookedSlots, slotTime];
    await doctorModel.findByIdAndUpdate(docId, {
      $set: {
        [`slots_booked.${slotDate}`]: updatedSlots
      }
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked",
      appointment,
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};


//my-appointment API
const listAppointment = async (req, res) => {
  try {

    const userId = req.user.id
    const appointments = await appointmentModel.find({ userId }).sort({ date: -1 })
    return res.json({
      success: true,
      message: "Appointment fetched successfully",
      appointments
    })

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
}


//appointment cancel API
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

    const { docId, slotDate, slotTime, userId } = appointment;

    if (req.user.id != userId) {
      return res.json({
        success: false,
        message: "You are not authorized to cancel this appointment"
      })
    }

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


const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

const paymentRazorpay = async (req, res) => {
  try {

    const { appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found"
      })
    }

    const options = {
      amount: appointmentData.amount * 100,
      currency: "INR",
      receipt: appointmentId
    }

    const order = await razorpayInstance.orders.create(options)

    return res.json({
      success: true,
      order
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
}

// API to verify payment
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    // Generate expected signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      await appointmentModel.findByIdAndUpdate(
        appointmentId,
        { payment: true }
      );

      return res.json({
        success: true,
        message: "Payment successful",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay, sendOtp };
