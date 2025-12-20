import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";

/* ===================== SIGN UP ===================== */
const signUp = async (req, res) => {
  try {
    const { Fullname, email, password, mobile, role } = req.body;

    // check existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // validations
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (!mobile || mobile.length < 10) {
      return res
        .status(400)
        .json({ message: "Mobile number must be at least 10 digits" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    user = await User.create({
      Fullname,
      email,
      password: hashedPassword,
      mobile,
      role,
    });

    // generate token
    const token = genToken(user._id);

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // true when https
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // remove password from response
    const { password: _, ...userWithoutPassword } = user._doc;

    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Signup failed: ${error.message}` });
  }
};

/* ===================== SIGN IN ===================== */
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = user._doc;

    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Signin failed: ${error.message}` });
  }
};

/* ===================== SIGN OUT ===================== */
const signOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    return res.status(200).json({ message: "Signout successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Signout failed: ${error.message}` });
  }
};

export { signUp, signIn, signOut };
