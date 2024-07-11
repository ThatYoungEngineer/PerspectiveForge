import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: "https://firebasestorage.googleapis.com/v0/b/perspectiveforge-2843b.appspot.com/o/default-blog.webp?alt=media&token=8dfc5869-f037-4021-8b99-63250ce2d95b" 
    },
}, {timestamps: true}
);

export const Post = mongoose.model("Post", postSchema);