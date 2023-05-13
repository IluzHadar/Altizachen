import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import data123 from '../data123.js';

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  //await User.deleteMany({});
  const createedUsers = await User.insertMany(data123.users);
  res.send({ createedUsers });
});

userRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404).send({ message: 'Please Enter Email And Password' });
  } else {
    const user = await User.findOne({ email }); //search the email id exist in data
    const passwordMatch = await bcrypt.compare(password, user.password); //check valid pass
    if (user && passwordMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        numberPhone: user.numberPhone,
        email: user.email,
        sumOfLike: user.sumOfLike,
        likeInAds: user.likeInAds,
      });
    } else {
      res.status(404).send({ message: 'Wrong Email / Invalid Password' });
    }
  }
});

userRouter.post('/', async (req, res) => {
  const { user } = req.body;
  try {
    const createdUser = await User.create(user);
    res.status(201).json(createdUser);
  } catch (err) {
    res.status(404).send({ message: 'Error - Try Again to create new user' });
  }
});


userRouter.put('/:id', async (req, res) => {
  console.log('req.body99-----------------------------------------------');
  console.log(req.body);
  console.log('req.body99-----------------------------------------------');
  const user = await User.findById(req.body._id);
  user.sumOfLike = user.sumOfLike + 1;
  user.likeInAds = req.body.likeInAds;
  user.userRating = (user.sumOfLike)/(req.body.userAdCounter);
  user.userAdCounter = req.body.userAdCounter;
  console.log('user99-----------------------------------------------');
  console.log( user);
  console.log('user99-----------------------------------------------');
  const updateuser= await user.save();
  res.send({ message: 'user Updated', user: updateuser });
  });

 
 


export default userRouter;
