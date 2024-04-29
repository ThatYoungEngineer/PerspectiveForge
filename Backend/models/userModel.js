import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    full_name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/thumbnails/020/911/740/small_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
    }
}, {timestamps: true}
);

export const User = mongoose.model("User", userSchema);
