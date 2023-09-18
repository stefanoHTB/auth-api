import mongoose, { Document, Schema, Model } from "mongoose";

enum UserRole {
  User = '2001',
  Editor = '',
  Admin = '',
}

export interface IUser extends Document {
  username: string;
  roles: {
    User: UserRole;
    Editor: UserRole;
    Admin: UserRole;
  };
  password: string;
  refreshToken: string[];
}

export const userSchema: Schema<IUser> = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: String,
      default: UserRole.User,
    },
    Editor: {
      type: String,
      default: UserRole.Editor,
    },
    Admin: {
      type: String,
      default: UserRole.Admin,
    },
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: [String],
});

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
