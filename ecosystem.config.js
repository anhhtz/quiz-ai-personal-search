module.exports = {
  apps: [
    {
      name: "quiz-ai-next",
      script: "pnpm",
      args: "run start",
      instances: 1, // Số lượng instance chạy
      autorestart: true, // Tự động khởi động lại nếu ứng dụng bị dừng
      watch: false, // Không theo dõi thay đổi mã nguồn
      max_memory_restart: "1G", // Khởi động lại nếu sử dụng quá 1GB bộ nhớ
      env: {
        NODE_ENV: "development", // Thiết lập biến môi trường
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
