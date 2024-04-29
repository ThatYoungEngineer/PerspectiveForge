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
        default: null    
    }
}, {timestamps: true}
);

export const User = mongoose.model("User", userSchema);
