import express from "express";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import path from 'path';

const __dirname = path.resolve()

const app = express();

const port = process.env.PORT || 8000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

// app.get('/', (req, res) => {
//     res.json({message: 'api is working'})
// })

app.use('/api', routes);

app.use(express.static(path.join(__dirname, 'Frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'dist', 'index.html'));
})

connectDB();