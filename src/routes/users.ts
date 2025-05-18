import e, { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { authenticate, AuthenticatedRequest } from '../models/middleware/auth';

const router = Router();

// 🗂️ Get all bookmarks for the authenticated user
router.get("/bookmarks", authenticate as any, async (req: AuthenticatedRequest, res: any) => {
  try {
    const user = await User.findById(req.userId).populate("bookmarks");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookmarks", error });
  }
});

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed', error });
  }
});

// User Login
router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'defaultSecret',
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
});

// Protected Route - Bookmark a Movie
router.post(
  '/bookmark/:movieId',
  authenticate as any,
  async (req: AuthenticatedRequest, res: any) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.bookmarks.push(req.params.movieId as any);
      await user.save();
      res.json({ message: 'Movie bookmarked' });
    } catch (error) {
      res.status(500).json({ message: 'Bookmarking failed', error });
    }
  }
);

// Protected Route - Like a Movie
router.post(
  '/like/:movieId',
  authenticate as any,
  async (req: AuthenticatedRequest, res: any) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.likes.push(req.params.movieId as any);
      await user.save();
      res.json({ message: 'Movie liked' });
    } catch (error) {
      res.status(500).json({ message: 'Liking failed', error });
    }
  }
);

// Protected Route - Watch a Movie
router.post(
  '/watch/:movieId',
  authenticate as any,
  async (req: AuthenticatedRequest, res: any) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.watchHistory.push(req.params.movieId as any);
      await user.save();
      res.json({ message: 'Movie added to watch history' });
    } catch (error) {
      res.status(500).json({ message: 'Watch history update failed', error });
    }
  }
);

export default router;
