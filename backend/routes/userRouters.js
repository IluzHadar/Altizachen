import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const userRouter = express.Router();

userRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404).send({ message: 'Please Enter Email And Password' });
  } else {
    const user = await User.findOne({ email });     //search the email id exist in data
    const passwordMatch = await bcrypt.compare(password, user.password);  //check valid pass
    if (user && passwordMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404).send({ message: 'Wrong Email / Invalid Password' });
    }
  }
});

export default userRouter;
