import { Schema, model } from "mongoose";

const UserSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  surname: String,
  bio: String,
  nick: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "role_user",
  },
  image: {
    type: String,
    default: "default.png",
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const User = model("User", UserSchema, "users");

export default User;
