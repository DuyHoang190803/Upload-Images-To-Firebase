import dotenv from "dotenv";
import app from "./app.js";
import os from "os";

// Tải biến môi trường từ .env file
dotenv.config();

function getPhysicalIPv4() {
  const networkInterfaces = os.networkInterfaces();
  const ignoredAdapters = ['vEthernet', 'VirtualBox', 'docker', 'TAP-Windows', 'Tailscale', 'Loopback'];

  for (const interfaceName in networkInterfaces) {
    // Bỏ qua các adapter ảo như 'vEthernet', 'docker', 'VirtualBox', 'TAP-Windows', 'Tailscale', 'Loopback', v.v.
    if (ignoredAdapters.some(adapter => interfaceName.includes(adapter))) {
      continue;
    }

    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      // Chỉ lấy IPv4 và bỏ qua các interface nội bộ (localhost)
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  return null; // Trả về null nếu không tìm thấy địa chỉ IP
}

const localIP = getPhysicalIPv4();
console.log("IP: ", localIP);

const PORT = process.env.PORT;
const HOSTNAME = localIP || "localhost"; // Sử dụng "localhost" nếu localIP là null hoặc undefined

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at: http://${HOSTNAME}:${PORT}`);
});