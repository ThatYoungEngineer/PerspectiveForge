import express from "express";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();

const port = process.env.PORT || 8000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

app.get('/', (req, res) => {
    res.json({message: 'api is working'})
})

app.use('/api', routes);


connectDB()