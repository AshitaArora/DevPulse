import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  githubId: string;
  username: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  githubProfileUrl?: string;
  encryptedAccessToken: string;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    githubProfileUrl: {
      type: String,
      default: '',
    },
    encryptedAccessToken: {
      type: String,
      required: true,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
