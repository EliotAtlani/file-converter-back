module.exports = {
  apps: [
    {
      name: 'file-converter-back',
      script: 'dist/main.js',
      instances: 2,
      autorestart: true,
      exec_mode: 'cluster',
    },
  ],
};
