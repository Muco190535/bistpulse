// PM2 ecosystem config — BIST Pulse
// Kullanım: pm2 start ecosystem.config.js
// Güncelleme: pm2 reload ecosystem.config.js (zero-downtime)

module.exports = {
  apps: [
    {
      name: 'bistpulse-api',
      script: './backend/server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '400M',
      node_args: '--max-old-space-size=384',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      time: true
    },
    {
      name: 'bistpulse-bot',
      script: './bot.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/bot-error.log',
      out_file: './logs/bot-out.log',
      time: true
    }
  ]
};
