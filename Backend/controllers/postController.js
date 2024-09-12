import { Post } from '../models/postModel.js'

export const createPost = async (req, res) => {
    const {title} = req.body;

    console.log('ye user hai: ', req.user)

    if(!req.user.isAdmin) return res.status(403).json({message: 'You are not allowed to create a post!'});
    if(!req.body.title || !req.body.category ||!req.body.description) return res.status(400).json({message: 'Fill out post details to publish!'});
    
    try {
        let slug = title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '');
    
        // Remove trailing dashes
        slug = slug.replace(/-+$/, '');
        
        // Check if the slug already exists in the database
        let existingSlug = await Post.findOne({ slug });
        let originalSlug = slug;
        let count = 1;
        
        // While a post with the same slug exists, append `-count` to the slug and increment the count
        while (existingSlug) {
            slug = `${originalSlug}-${count}`;
            existingSlug = await Post.findOne({ slug });
            count++;
        }
            
        const newPost = new Post ({
            author: req.user.id,
            title: req.body.title,
            category: req.body.category,
            description: req.body.description,
            image: req.body.blogImage,
            slug
        })    
    
        await newPost.save()
        res.status(200).json({message: 'Post published successfully'})

    } catch (error) {
        console.log(error)
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
        .limit(limit)
        
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No post found' })
        }

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

        res.status(200).json([posts, {
            totalPosts,
            lastMonthPosts
        }])  

    } catch (error) {
        if (error.message.includes('buffering timed out' || 'ETIMEOUT')) res.status(504).json({message: 'Network error! Please try again later.'})
        else res.status(500).json({ message: "Internal Server Error! Please try again later." })    
    }
}

export const deletePost = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({message: 'You do not have permission to delete this post.'})
    }
    try {
        const postToDelete = await Post.findOneAndDelete({_id: req.params.postId}) 
        if (!postToDelete) return res.status(404).json({ message: "Post not found" })
        else res.status(200).json({ message: "Post deleted successfully", postId: req.params.postId })
    } catch (error) {
        if (error.message.includes('buffering timed out' || 'ETIMEOUT')) res.status(504).json({message: 'Network error. Please try again later'})
        else res.status(500).json({ message: "Internal Server Error"})     
    }
}

export const updatePost = async (req, res) => {
    const {title} = req.body;

    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "You are not allowed to update this post." })
    }

    try {
        const postToUpdate = await Post.findById(req.params.postId);
    
        if (!postToUpdate) {
            return res.status(404).json({ message: "Post with this id does not exist." });
        }
    
        let slug = postToUpdate.slug; // Default to the current slug
        const { title, category, blogImage, description } = req.body;
    
        // Only generate a new slug if the title has changed
        if (title && postToUpdate.title !== title) {
            slug = title
                .split(' ')
                .join('-')
                .toLowerCase()
                .replace(/[^a-zA-Z0-9-]/g, '')
                .replace(/-+$/, ''); // Remove trailing dashes
    
            // Check if the slug exists and increment if necessary
            let existingSlug = await Post.findOne({ slug });
            let originalSlug = slug;
            let count = 1;
    
            while (existingSlug) {
                slug = `${originalSlug}-${count}`;
                existingSlug = await Post.findOne({ slug });
                count++;
            }
        }
    
        // Update the post with the new values (including the new or unchanged slug)
        const postToBeUpdated = await Post.findOneAndUpdate({ _id: req.params.postId },
            {
                $set: {
                    title,
                    category,
                    image: blogImage,
                    description,
                    slug
                }
            },
            { new: true } // Return the updated document
        );
    
        if (!postToBeUpdated) {
            return res.status(500).json({ message: "Failed to update post." });
        } else {
            return res.status(200).json({ message: "Post updated successfully."});
        }
    } catch (error) {
        if (error.message.includes('buffering timed out' || 'ETIMEOUT')) res.status(504).json({message: 'Network error. Please try again later'})
        else res.status(500).json({ message: "Internal Server Error"})         
    }
}