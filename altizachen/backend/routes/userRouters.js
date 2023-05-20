import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import data123 from '../data123.js';

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
 try{
  //await User.deleteMany({});
  const uesrs = await User.find();
  res.send(uesrs);
 }catch (err){
  console.log(err);
  res.status(404).send({ message: 'Error - file in get funcation in userRouters' });

 }
});

userRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404).send({ message: 'Please Enter Email And Password' });
  } else {
    try{
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
              isAdmin: user.isAdmin
            });
          } else {
            console.log('Wrong Email / Invalid Password');
            res.status(404).send({ message: 'Wrong Email / Invalid Password' });
          }
  }catch(err){
    res.status(404).send({ message: 'The Email or Password not matchs' });
  }
  }
});

userRouter.post('/', async (req, res) => {
  const { Newuser } = req.body;
  try {
    const createdUser = await User.create(Newuser);
    res.status(201).json(createdUser);
  } catch (err) {
    res.status(404).send({ message: 'Error - Try Again to create new user' });
  }
});


userRouter.put('/:id', async (req, res) => {
  const user1 = await User.findById(req.body._id);
  user1.sumOfLike = user1.sumOfLike + 1;

  user1.userRating = (user1.sumOfLike)/(req.body.userAdCounter);
  user1.userAdCounter = req.body.userAdCounter;
    const updateuser1= await user1.save();
  const user2 = await User.findOne({numberPhone: req.body.numberPhone});
  user2.likeInAds = req.body.likeInAds;
  const updateuser2= await user2.save();
  res.send({
    message: 'User updated successfully',
    user1: updateuser1,
    user2: updateuser2
  });
  });

 
 


export default userRouter;
