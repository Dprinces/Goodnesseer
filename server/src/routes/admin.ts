import express from 'express';
import Post from '../models/Post';
import Comment from '../models/Comment';
import Report from '../models/Report';

const router = express.Router();

// Get platform stats
router.get('/stats', async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    
    // Get recent reports
    const recentReports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      overview: {
        totalPosts,
        totalComments,
        totalReports,
        pendingReports
      },
      recentReports
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching admin stats', error: err });
  }
});

export default router;
