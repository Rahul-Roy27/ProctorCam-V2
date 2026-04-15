import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// connect MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(console.error);

// schema
const ProctoringSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  logs: Array
});

const Proctoring = mongoose.model("Proctoring", ProctoringSchema);

// API route
app.post("/api/proctoring/submit", async (req, res) => {
  try {
    const { logs } = req.body;

    const entry = new Proctoring({ logs });
    await entry.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save logs" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});