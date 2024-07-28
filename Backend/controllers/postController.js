import { Post } from '../models/postModel.js'

export const createPost = async (req, res) => {
    console.log(req.user)
    if(!req.user.isAdmin) return res.status(403).json({message: 'You are not allowed to create a post!'});
    if(!req.body.title || !req.body.category ||!req.body.description) return res.status(400).json({message: 'Fill out post details to publish!'});

    const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
    
    const newPost = new Post ({
        author: req.user._id,
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        image: req.body.image,
        slug
    })

    try {
        await newPost
        .save()
        .then(() => {
            res.status(200).json({message: 'Post published successfully'})
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error: ", error: error })        
    }
}