import mongoose, { Document, Schema, Model } from 'mongoose';

export type OrgRole = 'ORG_ADMIN' | 'MEMBER';

export interface IOrganizationMember extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orgRole: OrgRole;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationMemberSchema = new Schema<IOrganizationMember>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    orgRole: {
      type: String,
      enum: ['ORG_ADMIN', 'MEMBER'],
      default: 'MEMBER',
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate user memberships within the same organization
OrganizationMemberSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

export const OrganizationMember: Model<IOrganizationMember> =
  mongoose.models.OrganizationMember ||
  mongoose.model<IOrganizationMember>('OrganizationMember', OrganizationMemberSchema);
