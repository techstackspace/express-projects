// 📁 src/models/User.ts

import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  bookmarks: Types.ObjectId[];
  likes: Types.ObjectId[];
  watchHistory: Types.ObjectId[];
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
    watchHistory: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const User = model<IUser>("User", userSchema);
