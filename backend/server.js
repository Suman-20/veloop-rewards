import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";


dotenv.config();

const app = express();

//Connect to MongoDB
connectDB();

//Middleware
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    }
));
app.use(express.json());

//Route Test
app.use("/api/auth",authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/streak",streakRoutes);
app.use("/api/rewards", rewardRoutes);


//test route
app.get("/", (req, res) => {
     res.json({
        success: true,
        message: "Vellop Rewards Backend is running"});
});

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


