import e, { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { Movie } from '../models/Movie';
import { deleteFromCloudinary, upload, uploadToCloudinary } from '../config/cloudinary';

const router = Router();

// 👤 Get current logged-in user's profile
router.get(
  '/me',
  authenticate as any,
  async (req: AuthenticatedRequest, res: any) => {
    try {
      const user = await User.findById(req.userId)
        .populate('bookmarks')
        .populate('likes')
        .populate('watchHistory');

      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage, 
        bookmarks: user.bookmarks,
        likes: user.likes,
        watchHistory: user.watchHistory,
        createdAt: user.createdAt,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user profile', error });
    }
  }
);

// 🗂️ Get all bookmarks for the authenticated user
// 🗂️ Get paginated bookmarks for the authenticated user
router.get(
  '/bookmarks',
  authenticate as any,
  async (req: AuthenticatedRequest, res: any) => {
    try {
      const { limit = 10, page = 1 } = req.query;

      const perPage = parseInt(limit as string, 10);
      const currentPage = parseInt(page as string, 10);

      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const totalBookmarks = user.bookmarks.length;

      const paginatedBookmarks = await User.findById(req.userId).populate({
        path: 'bookmarks',
        options: {
          skip: (currentPage - 1) * perPage,
          limit: perPage,
          sort: { createdAt: -1 }, // Optional: sort bookmarks by movie creation
        },
      });

      res.json({
        page: currentPage,
        totalPages: Math.ceil(totalBookmarks / perPage),
        totalBookmarks,
        bookmarks: paginatedBookmarks?.bookmarks || [],
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch bookmarks', error });
    }
  }
);

// 📌 Get a specific bookmarked movie by its ID
router.get(
  '/bookmark/:movieId',
  authenticate as any,
  async (req: AuthenticatedRequest, res: any) => {
    try {
      const user = await User.findById(req.userId).populate('bookmarks');
      if (!user) return res.status(404).json({ message: 'User not found' });

      const movieId = req.params.movieId;

      // Check if the bookmark exists
      const bookmark = user.bookmarks.find(
        (bookmark: any) => bookmark._id.toString() === movieId
      );

      if (!bookmark) {
        return res.status(404).json({ message: 'Bookmark not found' });
      }

      res.json({ bookmark });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch bookmark', error });
    }
  }
);

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
// routes/users.ts

router.post(
  '/bookmark/:movieId',
  authenticate as any,
  async (req: AuthenticatedRequest, res: any) => {
    try {
      const user = await User.findById(req.userId);
      const movie = await Movie.findById(req.params.movieId);
      if (!user || !movie)
        return res.status(404).json({ message: 'User or Movie not found' });

      // Avoid duplicate bookmarks
      if (!user.bookmarks.includes(movie._id as any)) {
        user.bookmarks.push(movie._id as any);
        await user.save();
      }

      if (!movie.bookmarks.includes(user._id as any)) {
        movie.bookmarks.push(user._id as any);
        await movie.save();
      }

      res.json({ message: 'Movie bookmarked' });
    } catch (error) {
      res.status(500).json({ message: 'Bookmarking failed', error });
    }
  }
);

// ❌ Protected Route - Remove a bookmarked movie
router.delete(
  '/bookmark/:movieId',
  authenticate as any,
  async (req: AuthenticatedRequest, res: any) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const movieId = req.params.movieId;
      const originalLength = user.bookmarks.length;

      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== movieId);

      if (user.bookmarks.length === originalLength) {
        return res.status(404).json({ message: 'Bookmark not found' });
      }

      await user.save();
      res.json({ message: 'Bookmark removed' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove bookmark', error });
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

// 🔧 Update user details (authenticated user only)
router.patch(
  '/me',
  authenticate as any,
  upload.single('profileImageUrl'), // Handle optional file upload
  async (req: AuthenticatedRequest, res: any,  next: any) => {
    try {
      const userId = req.userId;
      const { username, email, password, profileImageUrl } = req.body;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Direct URL provided
      if (profileImageUrl) {
        user.profileImage = profileImageUrl;
      }

      // File uploaded
      if (req.file) {
        const uploadedUrl = await uploadToCloudinary(
          req.file.buffer,
          userId as any
        );
        user.profileImage = uploadedUrl;
      }

      if (username) user.username = username;
      if (email) user.email = email;
      if (password) user.password = password;

      await user.save();

      res.json({
        message: 'User updated successfully',
        profileImage: user.profileImage,
      });
    } catch (error) {
      // res.status(500).json({ message: 'Failed to update user', error });
      next(error);
    }
  }
);

router.delete(
  '/me',
  authenticate as any,
  async (req: AuthenticatedRequest, res: any) => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);

      if (!user) return res.status(404).json({ message: 'User not found' });

      // 1. Remove user ID from liked and bookmarked movies
      await Movie.updateMany(
        { likes: user._id },
        { $pull: { likes: user._id } }
      );
      await Movie.updateMany(
        { bookmarks: user._id },
        { $pull: { bookmarks: user._id } }
      );

      // 2. Delete profile image from Cloudinary
      if (user.profileImage) {
        const segments = user.profileImage.split('/');
        const publicId = segments[segments.length - 1].split('.')[0];
        await deleteFromCloudinary(publicId);
      }

      // 3. Delete user from database
      await User.findByIdAndDelete(userId);

      res.json({ message: 'User account deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete account', error });
    }
  }
);

export default router;
