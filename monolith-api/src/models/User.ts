import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "customer" | "vendor" | "admin";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidate: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      required: true,
    },
    permissions: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
