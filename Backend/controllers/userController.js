import { User } from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    const { full_name, email, password } = req.body

    if (!full_name || !email || !password || email === "" || password === "" || full_name === "") {
        return res.status(400).json({ message: 'All fields are required' })
    }
    if (full_name) {
        if (full_name.length < 3 ) {
            return res.status(400).json({ message: "Name must be at least 3 characters!" });
        }
        else if (full_name.length > 26 ) {
            return res.status(400).json({ message: "Name is too long" });
        } else if (!/^[a-zA-Z\s]+$/.test(full_name)) {
            return res.status(400).json({ message: "Invalid name!" })
        }
    } 

    try {
        const existingUser = await User.findOne({ email })
    
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists!' })
        }
    
        let username = ''
        const nameSlice = full_name.replace(/\s+/g, '').toLowerCase()
    
        const existingUsername = await User.findOne({ username: nameSlice })
        
        if (existingUsername) {
            const randomId = Math.floor(103 + Math.random() * 902);  // Generate a 3-digit random number
            username = nameSlice + randomId; // Append the random number to the name slice
        } else {
            username = nameSlice;
        }
    
        const hashPassword = bcryptjs.hashSync(password, 10); // Hash password
    
        const user = new User({
            username,
            full_name,
            email,
            password: hashPassword
        });
    
        await user.save();
        return res.status(201).json({ message: 'Signed Up successfully' });
    
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
            return res.status(401).json({ message: "Invalid Credentials! Please try again" });
        }

        else {
            const {password: pass, ...userData} = existingUser._doc
            const token = jwt.sign( { id: existingUser._id, isAdmin: existingUser.isAdmin }, process.env.JWT_SECRET_KEY, { expiresIn: '1h'} )    //by default its a one time session
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
    const { displayName, email, photoUrl } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            const { password: pass, ...userData } = user._doc;
            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' }
            );
            res
            .status(200)
            .cookie("jwt", token, { httpOnly: true })
            .json({ userData, message: "Signed In successfully" });
        } else {
            const generatePassword = Math.random().toString(36).slice(-8);
            const hashPassword = bcryptjs.hashSync(generatePassword, 10);

            const newUser = await new User({
                full_name: displayName,
                email,
                password: hashPassword,
                isAdmin: false,
                profilePhoto: photoUrl
            }).save();

            const { password: pass, ...userData } = newUser._doc;
            const token = jwt.sign(
                { id: newUser._id, isAdmin: newUser.isAdmin },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' }
            );

            res
            .status(200)
            .cookie("jwt", token, { httpOnly: true })
            .json({ userData, message: "Signed In successfully" });
        }
    } catch (err) {
        console.log("hello-err");
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("jwt", { path: "/" })
    res.status(200).json({ message: "Logged out successfully" });
}

//updateUser validation logic

const validateUsername = (username) => {
    if (!username) {
        return "Username is required!";
    } else if (username.length < 5) {
        return "Username must be at least 5 characters long!";
    } else if (username.length > 24) {
        return "Username must be no longer than 24 characters!";
    } else if (!/^[a-z0-9]+$/.test(username)) {
        return "Username must be in lowercase!";
    } else if (!/^(?=(.*[a-z]){3,})[a-z0-9]+$/.test(username)) {
        return "Invalid username!";
    }
    return null;
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
        if (req.body.full_name.length < 3 ) {
            return res.status(400).json({ message: "Name must be at least 3 characters!" });
        }
        else if (req.body.full_name.length > 26 ) {
            return res.status(400).json({ message: "Name is too long" });
        } else if (!/^[a-zA-Z\s]+$/.test(req.body.full_name)) {
            return res.status(400).json({ message: "Invalid name!" })
        }
    } 
    
    if (req.body.username) {
        const validationError = validateUsername(req.body.username)
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        const existingUsername = await User.findOne({ username: req.body.username })
        if (existingUsername && existingUsername._id.toString()!== req.params.userId) {
            return res.status(409).json({ message: "This username isn't available"})
        }    
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
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

export const deleteUser = async (req, res) => {
    if (req.user.id !== req.params.userId) {
        return res.status(403).json({message: "You are not allowed to delete this user!" });
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ message: "User deleted successfully!" })
        })
    } catch (e) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const checkUsername = async (req, res) => {
    const username = req.params.username.toLowerCase()
    try {
        const existingUsername = await User.findOne({ username })
        if (existingUsername) {
            return res.status(409).json({ message: "This username isn't available"})
        } else {
            return res.status(200).json({ message: 'This username is available'})
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const checkUserAuth = async (req, res) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
            if (err) {
                return res.status(401).json({ message: "Not Authorized! Please login again (invalid token)" });
            } else {
                return res.status(200)
            }
        })
    } else {
        return res.status(401).json({ message: "Not Authorized. No Token Found!" })
    }
}

export const getUsersData = async (req, res) => {
    if(!req.user.isAdmin) return res.status(403).json({message: 'Access denied!'});

    try {
        const totalUsers = await User.countDocuments()

        const currentTime = new Date()
        const oneMonthAgo = new Date(
            currentTime.getFullYear(),
            currentTime.getMonth() - 1,
            currentTime.getDate()
        )

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })

        res.status(200).json({
            totalUsers: totalUsers,
            lastMonthUsers: lastMonthUsers
        })  

    } catch (error) {
        if (error.message.includes('buffering timed out' || 'ETIMEOUT')) res.status(504).json({message: 'Network error! Please try again later.'})
        else res.status(500).json({ message: "Internal Server Error! Please try again later." })    
    }
}

export const getUserById = async (req, res) => {
    try {
        const {userId} = req.params
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        } else {
            return res.status(200).json(user);
        }
    } catch (error) {
        if (error.message.includes('buffering timed out' || 'ETIMEOUT')) res.status(504).json({message: 'Network error! Please try again later.'})
        else res.status(500).json({ message: "Internal Server Error! Please try again later." })    
    }

}
