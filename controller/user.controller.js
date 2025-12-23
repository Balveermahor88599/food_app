export const getCurrentUser = async (req, res) => {
  try {
    // 1. Check if user exists on the request object (from middleware)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized access: No user found in request" 
      });
    }

    // 2. Fetch user from DB and exclude password
    const user = await User.findById(req.user._id).select("-password");

    // 3. Check if user still exists in the database
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
    console.error("Get Current User Error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};