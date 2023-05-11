import mongoose from 'mongoose';

//Author: Matan
//Description:    numberPhoneUser: help us link ads to user that create same ads
//Comments:
//
//
//

const CommentsSchema = new mongoose.Schema(
  {
    //IdOfProduct: { type: String, required: true},
    commentID: { type: Number, required: true },
    body: { type: String, required: true },
    UploadDate: { type: String, required: true },
    EmailOwner: { type: String, required: true }, // ?
    PhoneOwner: { type: String, required: true }, // ?
    CommentOwner: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    image: { type: String },
    description: { type: String },
    category: { type: Number },
    UploadTime: { type: String},
    numberPhoneUser: { type: String},
    CountComments: { type: Number},
    reviews: [CommentsSchema],
    pauseAd: { type: Boolean},
    like: { type: Number },
    LastReqNumber: { type: Number},
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
