import express, { Request, Response } from "express";
import mongoose from "mongoose";
import movieRoutes from "./routes/movies";
import userRoutes from "./routes/users";

const app = express();
const PORT = Number(Bun.env.PORT) || 5000;
const MONGO_URI =
  Bun.env.MONGO_URI || "mongodb://localhost:27017/movies-db";

// Middleware
app.use(express.json()); // Parse JSON bodies

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.send("This is the home page");
});

app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);

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