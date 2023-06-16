import mongoose from 'mongoose';

const CommentsSchema = new mongoose.Schema(
  {
    commentID: { type: Number, required: true },
    body: { type: String, required: true },
    UploadDate: { type: String, required: true },
    EmailOwner: { type: String, required: true },
    PhoneOwner: { type: String, required: true },
    CommentOwner: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    OwnerAdID: { type: String },
    OwnerName: { type: String },
    OwnerRating: { type: Number },
    name: { type: String, unique: true },
    image: { type: String },
    description: { type: String },
    category: { type: Number },
    location: { type: String, required: true },
    UploadTime: { type: String },
    numberPhoneUser: { type: String },
    CountComments: { type: Number },
    reviews: [CommentsSchema],
    pauseAd: { type: Boolean },
    like: { type: Number },
    LastReqNumber: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
