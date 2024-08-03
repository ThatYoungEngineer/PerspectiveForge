import { Post } from '../models/postModel.js'

export const createPost = async (req, res) => {
    const {title} = req.body;

    if(!req.user.isAdmin) return res.status(403).json({message: 'You are not allowed to create a post!'});
    if(!req.body.title || !req.body.category ||!req.body.description) return res.status(400).json({message: 'Fill out post details to publish!'});
    
    try {
        const existingTitle = await Post.findOne({title})
        if(existingTitle) {
            return res.status(409).json({message: 'Post with this title already exists!'});
        }     

        let slug = title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '');

        const existingSlug = await Post.findOne({slug})
        const originalSlug = slug
        if(existingSlug) {
            const count = originalSlug.match(/-\d+$/)?.[0].slice(1) || 0
            slug += `-${count + 1}`
        }
        
        const newPost = new Post ({
            author: req.user._id,
            title: req.body.title,
            category: req.body.category,
            description: req.body.description,
            image: req.body.blogImage,
            slug
        })    
    
        await newPost.save()
        res.status(200).json({message: 'Post published successfully'})

    } catch (error) {
        if (error.message.includes('buffering timed out')) res.status(504).json({message: 'Network error. Please try again later'})
        else res.status(500).json({ message: "Internal Server Error"})        
    }
}

export const getPosts = async (req, res) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;
        
        const posts = await Post.find({
            ...(req.query.userId && {userId: req.query.userId}),
            ...(req.query.category && {category: req.query.category}),
            ...(req.query.slug && {slug: req.query.slug}),
            ...(req.query.postId && {_id: req.query.postId}),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { description: { $regex: req.query.searchTerm, $options: 'i'} }
                ]
            })
        })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)

        const totalPosts = await Post.countDocuments()

        const currentTime = new Date()
        const oneMonthAgo = new Date(
            currentTime.getFullYear(),
            currentTime.getMonth() - 1,
            currentTime.getDate()
        )

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts
        })  

    } catch (error) {
        console.log(error.message)
        if (error.message.includes('buffering timed out' || 'ETIMEOUT')) res.status(504).json({message: 'Network error. Please try again later'})
        else res.status(500).json({ message: "Internal Server Error"})    
    }
}