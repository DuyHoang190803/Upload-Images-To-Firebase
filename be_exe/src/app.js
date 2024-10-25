import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import router from "./api/routes/index.js";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();

dotenv.config();

app.use(express.json({ limit: "10mb" })); // Đặt kích thước tối đa là 5MB
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use(bodyParser.json());

app.use(morgan("dev"));
app.use(helmet());


const server = http.createServer(app);
const socketIo = new Server(server, {
    cors: {
        origin: ["http://localhost:8081"],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Enable credentials (important for cookies and authentication)
    },
});
app.use(cors({
    origin: ["http://localhost:8081"],
    methods: "GET, POST, PUT, DELETE, OPTIONS",
}))

app.use("/api", router); // Route tổng, gắn tất cả các route trong index.js

export default app;
