import { User } from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password || email === "" || password === "" || full_name === "") {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email })
        .then((existingUser) => {
            if (existingUser) return res.status(400).json({ message: 'User with this email already exists!' })
            else {
                const hashPassword = bcryptjs.hashSync(password, 10)
                const user = new User({
                    full_name,
                    email,
                    password: hashPassword
                })
                user
                .save().then(() => {
                    res.status(201).json({ message: 'Signed Up successfully' });
                })
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password || email === "" || password === "") {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({ message: "User with this email doesn't exist" });
        }

        const decryptPassword = bcryptjs.compareSync(password, existingUser.password)
        if (!decryptPassword) {
            return res.status(404).json({ message: "Invalid Credentials! Please try again" });
        }

        else {
            const {password: pass, ...userData} = existingUser._doc
            const token = jwt.sign( {id: existingUser._id}, process.env.JWT_SECRET_KEY, { expiresIn: '1h'} )    //by default its a one time session
            res
            .status(200)
            .cookie("jwt", token, {httpOnly: true})
            .json({ userData, message: "Signed In successfully" });
        }            

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}   

export const googleAuth = async (req, res) => {
    const {displayName, email, password, photoUrl} = req.body

    const user = await User.findOne({email})

    if (user) {
        try {
            const {password: pass, ...userData} = user._doc
            const token = jwt.sign( {id: user._id}, process.env.JWT_SECRET_KEY, { expiresIn: '1h'} )    //by default its a one time session
            res
            .status(200)
            .cookie("jwt", token, {httpOnly: true})
            .json({ userData, message: "Signed In successfully" });
        } catch (e) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    } else {
        try {
            const generatePassword = Math.random().toString(36).slice(-8)
            const hashPassword = bcryptjs.hashSync(generatePassword, 10)
            const newUser = new User({
                full_name: displayName,
                email,
                password: hashPassword,
                profilePhoto: photoUrl
            })
            newUser
            .save().then(() => {
                res.status(201).json({ message: 'Signed Up successfully' });
            })
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error" });
        }

    }

}

export const logout = (req, res) => {
    res.clearCookie("jwt", { path: "/" })
    res.status(200).json({ message: "Logged out successfully" });
}

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.jwt
    if (!token) {
        return res.status(401).json({ message: "Not Authorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Not Authorized" });
        }
        req.user = user
        next()
    })
}

export const updateUser = async (req, res) => {
    if (req.user.id !== req.params.userId) {
        return res.status(403).json({message: "You are not allowed to update this user" })
    }
    if (req.body.password) {
        if (req.body.password.length < 8 ) { 
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    if (req.body.full_name) {
        if (req.body.full_name.length > 26 ) {
            return res.status(400).json({ message: "Name is too long" });
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                full_name: req.body.full_name,
                password: req.body.password,
                profilePhoto: req.body.profilePhoto
            },
        } , {new: true})
        const { password, ...userData } = updatedUser._doc
        res.status(200).json({ userData, message: 'User updated successfully!'});

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (e) {
        res.status(500).json({ message: "Internal Server Error" });
    }

    }

    
// if(!existingUser) {
//     return res.status(404).json({ message: "Invalid Email" });
// } else if (existingUser.password !== password) {
//     return res.status(404).json({ message: "Invalid password" });
// }
