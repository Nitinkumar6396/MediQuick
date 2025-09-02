import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import {dbconnect} from '../config/database.js'
import cloudinaryConnect from '../config/cloudinary.js'
import adminRouter from '../routes/adminRoute.js'
import doctorRouter from '../routes/doctorRoute.js'
import userRouter from '../routes/userRoute.js'

import serverless from 'serverless-http'

// app config
const app = express();
const port = process.env.PORT || 5000
dbconnect()
cloudinaryConnect()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoint
app.get('/', (req, res) => {
    res.send("API Working...")
})

app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

// start server
// app.listen(port, () => console.log("Server started at port:", port))

export default serverless(app)
