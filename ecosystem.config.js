module.exports = {
  apps: [
    {
      name: 'bot-menfess',
      script: 'src/index.js',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
