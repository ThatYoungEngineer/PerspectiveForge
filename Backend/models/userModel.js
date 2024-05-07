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
        default: "https://firebasestorage.googleapis.com/v0/b/perspectiveforge-2843b.appspot.com/o/jin(dp).jpg?alt=media&token=900d5d4c-5298-4430-82ae-87f34d227d1e" 
    }
}, {timestamps: true}
);

export const User = mongoose.model("User", userSchema);
