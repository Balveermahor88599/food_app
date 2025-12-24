import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import jwt from "jsonwebtoken"; // Ye line add karein
import nodemailer from "nodemailer"; // Agar nodemailer use kar rahe hain toh ise bhi


// /* ===================== SIGN UP ===================== */
const signUp = async (req, res) => {
  try {
    const { Fullname, email, password, mobile, role } = req.body;

    // 1. Check existing user (Email OR Mobile)
    // Hum check kar rahe hain ki kya koi aisa user hai jiska email YA mobile match karta ho
    let existingUser = await User.findOne({ 
      $or: [ { email: email }, { mobile: mobile } ] 
    });

    if (existingUser) {
      // Specifically check karein ki problem email mein hai ya mobile mein
      if (existingUser.email === email) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
      if (existingUser.mobile === mobile) {
        return res.status(400).json({ success: false, message: "Mobile number already registered" });
      }
    }

    // 2. Manual Validations
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await User.create({
      Fullname,
      email,
      password: hashedPassword,
      mobile,
      role: role || "user",
    });

    // 5. Generate token
    const token = genToken(user._id);

    // 6. Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 7. Success Response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: userResponse
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};



/* ===================== SIGN IN ===================== */
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists and EXPLICITLY select password 
    // kyunki model mein 'select: false' hai
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      return res.status(400).json({ success: false, message: "User does not exist" });
    }

    // 2. Compare password
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    // 3. Generate token
    const token = genToken(user._id);

    // 4. Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // Production mein true karein
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 5. Remove password from response object
    const userResponse = user.toObject();
    delete userResponse.password;

    // 6. Return Success with proper structure
    return res.status(200).json({
      success: true,
      message: `Welcome back, ${userResponse.Fullname}`,
      user: userResponse
    });

  } catch (error) {
    console.error("Signin Error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: `Signin failed: ${error.message}` 
    });
  }
};
/* ===================== SIGN OUT ===================== */
export const signOut = async (req, res) => {
  try {
    // Cookie clear karte waqt options wahi rakhein jo login ke waqt the
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // Localhost ke liye false
    });

    // Frontend logic ke liye 'success: true' bhejna compulsory hai
    return res.status(200).json({ 
      success: true, 
      message: "Signout successfully ✅" 
    });
  } catch (error) {
    console.error("Signout Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: `Signout failed: ${error.message}` 
    });
  }
};



// Forgot Password Logic
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found with this email" });
    }

    // 2. Create a one-time Reset Token (15 mins valid)
    const resetToken = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "15m" }
    );

    // 3. Nodemailer Transport Setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Aapka Gmail
        pass: process.env.EMAIL_PASS, // Aapka Gmail App Password
      },
    });

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // 4. Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Link - TKT Food",
      html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password. This link is valid for 15 minutes.</p>
        <a href="${resetUrl}" style="background:#ff4d2d; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Reset link sent to your email" });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
};

/* ===================== RESET PASSWORD ===================== */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // 1. Token verify karein
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 2. Naya password hash karein
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Database mein password update karein
    const user = await User.findByIdAndUpdate(decoded.id, { 
      password: hashedPassword 
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Password reset successfully! You can login now." 
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(400).json({ 
      success: false, 
      message: "Link invalid hai ya expire ho chuka hai."  
    });
  }
};

/* ===================== GOOGLE SIGN IN ===================== */
const googleSignIn = async (req, res) => {
  try {
    const { email, Fullname, profilePic, role } = req.body; 

    // 1. User check karein
    let user = await User.findOne({ email });

    if (!user) {
      // 2. Naya user banate waqt mobile check
      // Agar '0000000000' pehle se DB mein hai, toh ye crash karega (Unique constraint ki wajah se)
      // Isliye Random String ya Email ka hi part mobile mein temporarily daal sakte hain
      const tempMobile = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;

      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      
      user = await User.create({
        email,
        Fullname,
        password: hashedPassword,
        profilePic: profilePic || "", 
        role: role || "user", 
        mobile: tempMobile // Har Google user ke liye unique temporary ID
      });
    }

    // 3. Token & Cookie (Aapka logic sahi hai)
    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.Fullname}`,
      user: {
        _id: user._id,
        email: user.email,
        Fullname: user.Fullname,
        role: user.role, // Purana role hi rahega agar account pehle se tha
        profilePic: user.profilePic || profilePic
      }
    });

  } catch (error) {
    console.error("Google Sign In Error:", error);
    // Unique key error handling (agar same mobile number dobara aaye)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "This account info conflicts with an existing user." });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Sabhi functions ko ek saath niche export karein
export { 
  signUp, 
  signIn, 
  googleSignIn 
};