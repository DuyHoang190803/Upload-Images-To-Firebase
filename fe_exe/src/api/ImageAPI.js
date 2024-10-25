import UnauthorApi from "./baseAPI/UnauthorBaseApi";

class ImageAPI {
  constructor() {
    this.url = "/api/images";
  }

  // Lấy tất cả hình ảnh
  getAllImages = async () => {
    return UnauthorApi.get(`${this.url}/get-all-images`);
  }

//   uploadImage = async (images) => {
//     // Nếu images không phải là mảng, chuyển nó thành mảng
//     if (!Array.isArray(images)) {
//       images = [images];
//     }
  
//     try {
//       const base64Images = await Promise.all(images.map(async (image) => {
//         if (image.uri) {
//           const response = await fetch(image.uri);
//           const blob = await response.blob();
//           const reader = new FileReader();
//           return new Promise((resolve, reject) => {
//             reader.onloadend = () => {
//               const base64data = reader.result;
//               resolve(base64data); // Trả về chuỗi Base64
//             };
//             reader.onerror = reject;
//             reader.readAsDataURL(blob); // Chuyển đổi blob thành chuỗi Base64
//           });
//         }
//         return null;
//       }));
  
//       // Gửi yêu cầu POST với Base64
//       const response = await UnauthorApi.post(
//         `${this.url}/upload-new-image`,
//         { images: base64Images.filter(Boolean) }, // Lọc bỏ các giá trị null
//         {
//           headers: {
//             'Content-Type': 'application/json', // Đảm bảo tiêu đề đúng
//           },
//         }
//       );
      
//       console.log("Upload thành công:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Lỗi khi tải lên hình ảnh:", error.message);
//       console.error("Chi tiết lỗi:", error.response ? error.response.data : error);
//       throw error;
//     }
//   };
  
  
  
  uploadImage = async (formData) => {
    return UnauthorApi.post(`${this.url}/upload-new-image`, formData);
  };



}

export default new ImageAPI();
