import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IOrganizationSettings {
  anonymizeMetrics: boolean;
  minTeamSizeDisplay: number;
}

export interface IOrganization extends Document {
  name: string;
  slug: string;
  avatarUrl?: string;
  createdBy: mongoose.Types.ObjectId;
  settings: IOrganizationSettings;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    settings: {
      anonymizeMetrics: {
        type: Boolean,
        default: false,
      },
      minTeamSizeDisplay: {
        type: Number,
        default: 3,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Organization: Model<IOrganization> =
  mongoose.models.Organization || mongoose.model<IOrganization>('Organization', OrganizationSchema);
