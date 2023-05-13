import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

//Author: Matan
//Description:    Every user qunique by email + numberPhone
//Comments: 
//
//
//

const likesProductsByUserSchema = new mongoose.Schema(
  {
    product_id:  { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    numberPhone: {type: String, required: true,},
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    sumOfLike: { type: Number, required: true },
    userRating:  { type: Number, required: true },
    userAdCounter: { type: Number, required: true },
    likeInAds: [String],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
