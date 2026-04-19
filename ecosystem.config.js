module.exports = {
  apps: [
    {
      name: 'bistpulse-api',
      script: './backend/dist/server.js',
      instances: 1,
      max_memory_restart: '400M',  // 400MB'ı geçerse otomatik restart
      node_args: '--max-old-space-size=384',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
