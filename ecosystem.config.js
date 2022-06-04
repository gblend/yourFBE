const {config} = require('./config/config');

module.exports = {
  apps : [{
    name: config.app.name,
    script: 'app.js',
    min_uptime: 36000,
    watch: '.',
    ignore_watch: ['logs', 'coverage', '.git', '.gitignore'],
    watch_options: {
      followSymlinks: false
    },
    error_file: './logs/pm2.log',
    combine_logs: true,
    max_restarts: 3,
    instances: 1,
    env_production: {
      NODE_ENV: 'production'
    },
    env_development: {
      NODE_ENV: 'development'
    }
  }],
};