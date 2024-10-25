// routes/uploadRouter.js

import express from "express";
import uploadImages from "../services/image.service.js";
import upload from "../../middlewares/uploadMiddleware.js"; 
import handleUploadErrors from "../../middlewares/handleUploadErrors.js"; 

const UploadRouter = express.Router();

UploadRouter.post("/upload", (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return handleUploadErrors(err, req, res);
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).send("Không có file nào được upload.");
      }

      const uploadedFiles = await uploadImages(req.files);
      res.status(200).json(uploadedFiles);
    } catch (error) {
      next(error);
    }
  });
});


export default UploadRouter;
