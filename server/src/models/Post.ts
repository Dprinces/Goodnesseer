import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  content: string;
  category: string;
  tags: string[];
  alias: string;
  upvotes: number;
  downvotes: number;
  voters: Map<string, string>; // userId -> 'upvote' | 'downvote'
  flagged: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Mental Health",
        "Relationships",
        "Work Stress",
        "Life Advice",
        "Faith",
        "Other",
      ],
    },
    tags: [{ type: String }],
    alias: { type: String, default: "Anonymous" },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    voters: {
      type: Map,
      of: String,
      default: {},
    },
    flagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
