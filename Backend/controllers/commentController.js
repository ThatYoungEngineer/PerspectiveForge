import { Comment } from "../models/commentModel.js";

export const postComment = async (req, res) => {
    console.log(req.body)
    try {
        const {content, postId, userId} = req.body

        if (userId !== req.user.id) {
            return res.status(403).json({ message: 'You are not allowed to post comment!' })
        }
        if (!content ||!postId ||!userId) {
            return res.status(400).json({ message: 'Missing attributes! Can not post comment' })
        }

        const comment = new Comment({
            content,
            postId,
            userId
        })
        await comment.save()
        res.status(200).json({ message: 'Comment posted successfully!' })
    } catch (error) {
        if (error.message.includes('buffering timed out' || 'ETIMEOUT')) res.status(504).json({ message: 'Network error. Please try again later'})
        else res.status(500).json({ message: "Internal Server Error"})
    }
}