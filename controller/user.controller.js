// 1. Add this import (check your actual file path/name for the User model) 
import User from "../models/user.models.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized access: No valid user ID in token" 
      });
    }

    // 2. Now "User" will be defined here
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found in database" 
      });
    }

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    // This is where you were seeing the "User is not defined" log
    console.error("Get Current User Error:", error.message); 
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};