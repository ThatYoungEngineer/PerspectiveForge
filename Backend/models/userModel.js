import mongoose from "mongoose"

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
        default: "https://c4.wallpaperflare.com/wallpaper/966/456/890/tekken-tag-tournament-2-jin-kazama-2560x1600-video-games-tekken-hd-art-wallpaper-preview.jpg" 
    }
}, {timestamps: true}
);

export const User = mongoose.model("User", userSchema);
