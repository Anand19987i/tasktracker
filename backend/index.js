import cookieParser from "cookie-parser";
import express from "express"
import dotenv from "dotenv"
import { createServer} from "http";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import userRoute from "./routes/user.route.js"
import taskRoute from "./routes/task.route.js"
import projectRoute from "./routes/project.route.js"


dotenv.config({})

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

const corsOptions = {
    // origin: "https://tasktracker-5ty2.onrender.com",
    origin: "http://localhost:5173",
    credentials: true,
}

app.use(cors(corsOptions));


app.use("/api/v1/user", userRoute);
app.use("/api/v1/task", taskRoute);
app.use("/api/v1/project", projectRoute);

const port = process.env.PORT;
connectDB();
const server = createServer(app);

server.listen(port, () => {
    console.log(`Server is running ${port}`);
})