module.exports = {
  apps : [{
    name: 'AgentPlus Watcher',
    script: 'dist/app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '300M'
  }],
};
