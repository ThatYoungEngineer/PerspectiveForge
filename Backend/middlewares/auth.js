import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.jwt
    if (!token) {
        return res.status(401).json({ message: "Not Authorized! Please login again (no token found)" });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Not Authorized! Please login again (invalid token)" });
        }
        req.user = user
        next()
    })
}