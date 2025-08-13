import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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
    avatar: {
      type: String,
      default:
        "https://market.enonic.com/vendors/enonic/simple-idprovider/_/attachment/inline/02473e24-0416-4994-a9f6-eb8b0f576723:96aa09af94b29ab893b1d3e0de00291daf31d36e/simpleid-icon.svg",
    },
  },
  { timestamps: true }
);

const User = mongoose.model(`User`, userSchema);

export default User;
