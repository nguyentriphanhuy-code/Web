const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Cấu hình để máy chủ đọc được dữ liệu JSON gửi từ web về
app.use(express.json());

// Hàm bắt IP thực tế (xử lý cả khi chạy qua proxy hoặc local)
function getClientIp(req) {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
}

// Lắng nghe yêu cầu ngầm từ trang web gửi lên
app.post('/report-visitor', (express.json()), (req, res) => {
    let ip = getClientIp(req);
    // Định dạng lại IP nếu là IPv4 nội bộ
    if (ip === '::1' || ip === '::ffff:127.0.0.1') { ip = '127.0.0.1 (Localhost)'; }
    
    const device = req.body.device || "Không rõ thiết bị";

    // In trực tiếp thông tin lên màn hình đen của Termux
    console.log('\n--- 🚨 CÓ NGƯỜI TRUY CẬP WEBSITE ---');
    console.log(`⏱️ Thời gian: ${new Date().toLocaleString('vi-VN')}`);
    console.log(`🌐 Địa chỉ IP: ${ip}`);
    console.log(`📱 Thiết bị : ${device}`);
    console.log('------------------------------------');
    
    res.sendStatus(200); // Trả về trạng thái OK chạy ngầm cho web
});

// Chỉ định thư mục công khai chứa file index.html
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Hệ thống giám sát đã bật! Web đang chạy tại: http://localhost:${port}`);
    console.log(`📌 Hãy giữ màn hình Termux này để theo dõi nhật ký kết nối...`);
});

