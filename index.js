import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import router from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";


const app = express();
const PORT = process.env.PORT || 3000;

// cors configuration
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,
}));

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", router);
app.use("/api/user", userRouter);

// start server only after DB connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server ❌", error.message);
    process.exit(1);
  }
};

startServer();
