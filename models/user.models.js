import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    Fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // 🔐 password query me by default nahi aayega
    },

    mobile: {
      type: String,
      required: [false, "Mobile number is required"],
      minlength: 10,
      maxlength: 10,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },

    role: {
      type: String,
      enum: ["user", "owner", "deliveryBoy"],
      default: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
