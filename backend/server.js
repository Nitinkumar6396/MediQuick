import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { dbconnect } from './config/database.js'
import cloudinaryConnect from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

// app config
const app = express();
const PORT = process.env.PORT || 5000;

// connect DB & Cloudinary
dbconnect();
cloudinaryConnect();

// middlewares
app.use(express.json());
app.use(cors({
  origin:'https://medi-quick-panel.vercel.app',
  credentials:true
}));

// api endpoint
app.get('/', (req, res) => {
  res.send("API Working...");
});

app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

// listen for requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
