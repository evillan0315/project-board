module.exports = {
  apps: [
    {
      name: "project-board",
      script: "npx vite dev --host", // run compiled output directly
      instances: 1,
      exec_mode: "fork",          // or "cluster" for load-balanced multi-core
      watch: false,
      autorestart: true,          // ensure restart on crash
      max_memory_restart: "1G",   // restart on memory overflow
      env: {
        NODE_ENV: "development",
        PORT: 3000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000
      },
      out_file: "./logs/combined.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm Z"
    }
  ]
};

