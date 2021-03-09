import mongoose from 'mongoose';

// 스키마 생성
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String],
  publishedData: {
    type: Date,
    default: Date.now,
  },
});

// 모델 생성
const Post = mongoose.model('Post', PostSchema);

export default Post;
