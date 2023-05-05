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
    commentID: { type: Number, required: true},
    body: { type: String, required: true},
    UploadDate: { type: String, required: true},
    EmailOwner: { type: String, required: true},        // ?
    PhoneOwner: { type: String, required: true},        // ?
    CommentOwner: { type: String, required: true},
  

  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Number, required: true },
    UploadTime: { type: String, required: true },
    numberPhoneUser: { type: String, required: true },
    CountComments: { type: Number, required: true },
    reviews: [CommentsSchema],
    pauseAd: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
