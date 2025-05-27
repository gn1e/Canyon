import { Schema, Document, model } from "mongoose";


export interface IUser extends Document {
  accountId: string;
  username: string;
  ip: string;
  email: string;
  password: string;
  created: Date;
  banned: boolean;
}

const UserSchema = new Schema<IUser>({
  accountId: { type: String, required: true },
  username: { type: String, required: true },
  ip: { type: String, default: "null" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created: { type: Date, default: Date.now },
  banned: { type: Boolean, default: false },
});


const User = model<IUser>("User", UserSchema);


export default User;
