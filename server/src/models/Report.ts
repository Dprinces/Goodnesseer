import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  targetId: mongoose.Types.ObjectId;
  targetType: 'Post' | 'Comment';
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetType: { type: String, enum: ['Post', 'Comment'], required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<IReport>("Report", ReportSchema);
