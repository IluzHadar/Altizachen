import mongoose from 'mongoose';

//Author: Matan
//Description:    
//Comments: 
//
//
//


const CommentsSchema = new mongoose.Schema(
  {
    IdOfProduct: { type: String, required: true},
    CommentID: { type: String, required: true},
    body: { type: String, required: true},
    UploadDate: { type: String, required: true},
    EmailOwner: { type: String, required: true},        // ?
    PhoneOwner: { type: String, required: true},        // ?
    CommentOwner: { type: Number, required: true},

  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', CommentsSchema);
export default Comment;
