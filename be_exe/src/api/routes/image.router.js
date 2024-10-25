import express from "express";
import upload from "../../middlewares/uploadMiddleware.js";
import { uploadFiles, getImages, test } from "../controllers/image.controller.js";
import handleUploadErrors from "../../middlewares/handleUploadErrors.js";
import uploadImages from "../services/image.service.js";

const router = express.Router();


router.post("/upload-new-image", uploadFiles);


// router.post("/upload-new-image", (req, res, next) => {
//   upload(req, res, async (err) => {
//     if (err.files) {
//       return handleUploadErrors(err, req, res);
//     }

//     try {
//         console.log(req.body)
//       if (!req.files || req.files.length === 0) {
//         return res.status(404).send("Không có file nào được upload.");
//       }

//       const uploadedFiles = await uploadImages(req.files);
//       res.status(200).json(uploadedFiles);
//     } catch (error) {
//       next(error);
//     }
//   });
// });


router.get("/get-all-images", getImages);

export default router;
