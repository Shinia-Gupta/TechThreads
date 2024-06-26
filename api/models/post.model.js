import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [5, "Title must be at least 5 characters"],
    },
    image: {
      type: String,
      default:
        "https://www.mindinventory.com/blog/wp-content/uploads/2022/03/react-nodejs.webp",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
