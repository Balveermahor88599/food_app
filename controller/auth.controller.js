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
    const token = await genToken(UserData._id);
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

const signIn = async(req, res) => {
  try {
    const {  email, password } = req.body;
    const UserData = await User.findOne({ email });
    if (!UserData) {
      return res.status(400).json({ message: "User Does Not exists" });
    }
    
    const isPasswordMatched = await bcrypt.compare(password, UserData.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    const token = await genToken(UserData._id);
    req.cookies("token", token, {
           secure: false,
           sameSite: "strict",
           httpOnly: true,
           maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json(UserData);
  } catch (error) {
    return res.status(500).json(`signup failed ${error.message}`);
  }
};

const signOut = async(req, res) => {
  try {
    res.clearCookie("token", {
      secure: false,
      sameSite: "strict",
      httpOnly: true,
    });
    return res.status(200).json({ message: "Signout Successfully" });
  } catch (error) {
    return res.status(500).json(`Signout failed ${error.message}`);
  }
};

export { signUp, signIn, signOut };