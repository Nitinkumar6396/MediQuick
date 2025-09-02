import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
  try {
    //Get token from Authorization header
    const {token} = req.headers
    if(!token){
        return res.status(404).json({
            success:false,
            message:"No token provided"
        })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.doctor = { id: decoded.id };

    next();
  } 
  catch (err) {
    console.error(err);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: err.message
    });
  }
};

export default authDoctor;
