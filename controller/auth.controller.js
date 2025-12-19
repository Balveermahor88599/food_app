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
    UserData = await User.create({
      Fullname,
      email,
      password: hassedPassword,
      mobile,
      role,
    });
    const token = await genToken(user._id);
    req.cookies("token", token, {
           secure: false,
           sameSite: "strict",
           httpOnly: true,
           maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(201).json(UserData);
  } catch (error) {
    return res.status(500).json(`signup failed ${error.message}`);
  }
};