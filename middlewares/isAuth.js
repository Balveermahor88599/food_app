import jwt from 'jsonwebtoken';

const isAuth = async (req, res, next) => {
  try {
    // 1. Get token from cookies OR Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated. Please login again." 
      });
    }

    // 2. Verify token
    // This will throw an error if the token is expired or tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach decoded payload to request
    // We attach it to req.user so the next middleware/controller can access it
    req.user = decoded; 
    
    // Proceed to the controller (e.g., getCurrentUser)
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    
    // Handle specific JWT errors for clearer frontend feedback
    const message = error.name === 'TokenExpiredError' 
      ? "Session expired. Please login again." 
      : "Authentication failed. Invalid token.";

    return res.status(401).json({ 
      success: false, 
      message: message
    });
  }
};

export default isAuth;