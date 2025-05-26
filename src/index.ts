import express, { Request, Response } from "express";
import mongoose from "mongoose";
import movieRoutes from "./routes/movies";
import userRoutes from "./routes/users";
import multer from "multer";

const app = express();
const PORT = Number(Bun.env.PORT) || 5000;
const MONGO_URI =
  Bun.env.MONGO_URI || "mongodb://localhost:27017/movies-db";

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); 

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.send("This is the home page");
});

app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);

// Error-handling middleware (should be after all routes)
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors (e.g. file too large)
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Max size is 2MB.' });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    // Other errors
    return res.status(500).json({ message: 'Something went wrong', error: err.message });
  }

  next();
});

// DB connection + server start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });