module.exports = {
  apps : [{
    name: 'agw',
    script: 'app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '300M'
  }],
};
