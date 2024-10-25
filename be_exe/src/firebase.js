import admin from "firebase-admin";
import serviceAccount from "../testsaveimage-1cbb4-firebase-adminsdk-jg7a8-fa94e73026.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://testsaveimage-1cbb4.appspot.com", // Kiểm tra lại Storage bucket name
});

const bucket = admin.storage().bucket(); // Sử dụng bucket cho việc upload
export default bucket;
