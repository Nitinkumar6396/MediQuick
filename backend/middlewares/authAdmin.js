import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
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

    //Check if role is admin
    if (decoded.role !== "Admin" || decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Invalid admin token"
      });
    }

    next();
  } 
  catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: err.message
    });
  }
};

export default authAdmin;
