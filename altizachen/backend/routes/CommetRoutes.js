import express from 'express';
import Comment from '../models/CommentsModel.js';
import data123 from '../data123.js';

const CommetRouter = express.Router();

CommetRouter.get('/', async (req, res) => {
  await Comment.deleteMany({});
  const createComment = await Comment.insertMany(data123.Comments);
  res.send({ createComment });
});


CommetRouter.post('/', async (req, res) => {
  const { comment } = req.body;
  try {
    const createComment = await Comment.create(comment);
    res.status(201).json(createComment);
 } catch (err) {
    res.status(404).send({ message: 'Error - Try Again to add comment' });
  }
});

export default CommetRouter;
