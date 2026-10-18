import { model, Schema } from "mongoose";

const ArticleSchema = new Schema(
  {
    // _id: ObjectId,
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    subtitle: {
      type: String,
    },
    description: {
      type: String,
    },
    pages: [
      {
        // _id: ObjectId,
        title: {
          type: String,
          required: true,
        },
        imgURL: {
          type: String,
          required: false,
        },
        content: {
          type: String,
          required: true,
        },
        page: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const Article = model("Article", ArticleSchema);

export default Article;
