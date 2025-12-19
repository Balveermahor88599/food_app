import User from "../models/user.models";
import bcrypt from "bcryptjs";
import genToken from "../utils/token";
const signUp = async(req, res) => {
  try {
    const { Fullname, email, password, mobile, role } = req.body;
    const UserData = await User.findOne({ email });
    if (UserData) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    if (mobile.length < 10) {
      return res.status(400).json({ message: "Mobile number must be at least 10 digits" });
    }
    const hassedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      Fullname,
      email,
      password: hassedPassword,
      mobile,
      role,
    });
    const token = await genToken(user._id);
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};