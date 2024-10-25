import express from "express";
import imageRouter from "./image.router.js";

const router = express.Router();

router.use("/images", imageRouter); 

export default router;
