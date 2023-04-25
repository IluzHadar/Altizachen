import mongoose from 'mongoose';

//Author: Matan
//Description:    numberPhoneUser: help us link ads to user that create same ads
//Comments: 
//
//
//


const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    category: {type: Number, required: true },
    UploadTime: {type: String, required: true},
    numberPhoneUser: {type: String , required: true},
   
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
