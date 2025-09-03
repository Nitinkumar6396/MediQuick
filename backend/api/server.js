import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { dbconnect } from '../config/database.js'
import cloudinaryConnect from '../config/cloudinary.js'
import adminRouter from '../routes/adminRoute.js'
import doctorRouter from '../routes/doctorRoute.js'
import userRouter from '../routes/userRoute.js'

import serverless from 'serverless-http'

// --- app config ---
const app = express()

// middlewares
app.use(express.json())
app.use(cors())

// Connect DB & Cloudinary only once (lazy connection)
let isInitialized = false
const initServices = async () => {
  if (!isInitialized) {
    await dbconnect()
    cloudinaryConnect()
    isInitialized = true
  }
}

// --- routes ---
app.get('/', async (req, res) => {
  await initServices()
  res.send("API Working...")
})

app.use('/api/admin', async (req, res, next) => {
  await initServices()
  next()
}, adminRouter)

app.use('/api/doctor', async (req, res, next) => {
  await initServices()
  next()
}, doctorRouter)

app.use('/api/user', async (req, res, next) => {
  await initServices()
  next()
}, userRouter)

// --- export for vercel ---
export default serverless(app)
