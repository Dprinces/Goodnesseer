import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  content: string;
  alias: string;
  upvotes: number;
  downvotes: number;
  voters: Map<string, string>; // userId -> 'upvote' | 'downvote'
  flagged: boolean;
  editToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
    alias: { type: String, default: "Anonymous" },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    voters: {
      type: Map,
      of: String,
      default: {},
    },
    flagged: { type: Boolean, default: false },
    editToken: { type: String, select: false },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
