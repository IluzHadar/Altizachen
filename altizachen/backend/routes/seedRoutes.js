import express from 'express';
import Product from '../models/produtModel.js';
import data123 from '../data123.js';
import User from '../models/userModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
   await Product.deleteMany({});
   const createdProducts = await Product.insertMany(data123.products);
   res.send({ createdProducts });
  // await User.deleteMany({});
  // const createedUsers = await User.insertMany(data123.users);
  // res.send({ createedUsers });
});
export default seedRouter;
