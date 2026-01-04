import express from 'express';
import Report from '../models/Report';
import Post from '../models/Post';
import Comment from '../models/Comment';

const router = express.Router();

// Submit a report
router.post('/', async (req, res) => {
  try {
    const { targetId, targetType, reason } = req.body;

    if (!['Post', 'Comment'].includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    // Verify target exists
    if (targetType === 'Post') {
      const exists = await Post.exists({ _id: targetId });
      if (!exists) return res.status(404).json({ message: 'Post not found' });
    } else {
      const exists = await Comment.exists({ _id: targetId });
      if (!exists) return res.status(404).json({ message: 'Comment not found' });
    }

    const newReport = new Report({
      targetId,
      targetType,
      reason,
    });

    const savedReport = await newReport.save();
    
    // Optional: Auto-flag content if it receives X reports?
    // For now, just save the report.

    res.status(201).json(savedReport);
  } catch (err) {
    res.status(400).json({ message: 'Error submitting report', error: err });
  }
});

export default router;
