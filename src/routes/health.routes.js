export function healthCheck(req, res) {
  res.json({
    ok: true,
    message: 'Service is healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
}