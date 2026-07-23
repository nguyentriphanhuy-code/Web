const express = require('express');
const path = require('path');
const helmet = require('helmet');
const app = express();
const port = process.env.PORT || 3000;

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://onrender.com"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"]
        }
    }
}));

// Cấu hình máy chủ web và nhận diện dữ liệu gửi từ web về
app.use(express.json());

// Hàm tự lấy IP thật của khách khi chạy qua proxy hoặc local
function getClientIp(req) {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
}

// Lắng nghe yêu cầu gửi thông tin từ trang web gửi lên
app.post('/report-visitor', (req, res) => {
    let ip = getClientIp(req);
    // Ép định dạng lại IP nếu là IPv4 nội bộ
    if (ip === '::1' || ip === '::ffff:127.0.0.1') { ip = '127.0.0.1 (Localhost)'; }
    
    const device = req.body.device || "Không rõ thiết bị";
    
    // In trực tiếp thông tin lưu lượng lên màn hình của Termux
    console.log('\n--- 👤 CÓ NGƯỜI TRUY CẬP WEBSITE ---');
    console.log(`⏱️ Thời gian: ${new Date().toLocaleString('vi-VN')}`);
    console.log(`🌐 Địa chỉ IP: ${ip}`);
    console.log(`📱 Thiết bị: ${device}`);
    console.log('---------------------------------');
    
    res.sendStatus(200); // Trả về trạng thái OK chạy ngầm cho web
});

// Chỉ định thư mục công khai chứa file index.html
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Hệ thống giám sát bắt đầu! Web đang chạy tại: http://localhost:${port}`);
    console.log(`📝 Hãy giữ màn hình Termux này để theo dõi lưu lượng kết nối...`);
});
