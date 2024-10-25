import bucket from "../../firebase.js";
import { v4 as uuid } from "uuid";
import imageService from "../services/image.service.js";


export const test = async (req, res) => {
  try {
    // Kiểm tra nếu có file được gửi lên
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }

    // Tạo một mảng chứa thông tin chi tiết của các file
    const fileInfo = req.files.map((file, index) => ({
      originalName: file.originalname,
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
    }));

    // Log thông tin chi tiết của tất cả các file được upload
    console.log("Uploaded files:", fileInfo);

    // Trả về thông tin chi tiết của các file đã tải lên
    res.status(200).json({
      message: "Files uploaded successfully",
      files: fileInfo,
      body: req.body, // Nếu có dữ liệu khác được gửi kèm
    });
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  }
};


// export const uploadFiles = async (req, res) => {
//   console.log(req.body)
//     // const imageFiles = req.body.images;
//     // const uploadedFiles = await imageService.uploadImages(imageFiles);
  
// };


export const uploadFiles = async (req, res, next) => {
  try {
    const data = req.body;
    const createdImages = await imageService.uploadImages(data.images);
    res.status(201).json({
      message: "Anh đã được tạo thành công!",
      images: createdImages,
    });
  } catch (error) {
    next(error);
  }
};



// Xử lý upload nhiều file lên Firebase Storage
// export const uploadFiles = async (req, res) => {
//   try {
//   // Kiểm tra xem có file nào được upload hay không
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).send("No files uploaded.");
//     }
//     console.log(req.files)
//     // Tiến hành xử lý tệp tin ở đây

//     const uploadedFiles = [];
//     const uploadPromises = req.files.images.map(async (file) => {
//       const fileName = `${file.originalname}-${uuid()}`; // Tạo tên file duy nhất với uuid
//       const fileUpload = bucket.file(fileName);

//       const blobStream = fileUpload.createWriteStream({
//         metadata: { contentType: file.mimetype },
//       });

//       return new Promise((resolve, reject) => {
//         blobStream.on("error", reject);

//         blobStream.on("finish", async () => {
//           const url = await fileUpload.getSignedUrl({
//             action: "read",
//             expires: "03-17-2025", // URL hết hạn vào thời điểm này
//           });
//           uploadedFiles.push({ fileName, url: url[0] });
//           resolve();
//         });

//         blobStream.end(file.buffer);
//       });
//     });

//     await Promise.all(uploadPromises);
//     res.status(200).send(uploadedFiles);

//   } catch (error) {
//     res.status(501).send(error);
//   }
// };

// Lấy tất cả các ảnh đã upload từ Firebase Storage
export const getImages = async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const url = await file.getSignedUrl({
          action: "read",
          expires: "03-17-2025", // URL hết hạn vào thời điểm này
        });
        return { fileName: file.name, url: url[0] };
      })
    );
    res.status(200).send(imageUrls);
  } catch (error) {
    res.status(500).send(error);
  }
};
