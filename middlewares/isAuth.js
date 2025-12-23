import jwt from 'jsonwebtoken'; // Changed from 'import React'

const isAuth = async (req, res, next) => {
  try {
    // 1. Get token from cookies
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid or expired token" 
      });
    }

    // 3. Attach decoded payload to request
    // Make sure the key matches what you used when signing the token (e.g., userId or _id)
    req.user = decoded; 
    
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ 
      success: false, 
      message: "Authentication failed" 
    });
  }
};

export default isAuth;