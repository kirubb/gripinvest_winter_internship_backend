const db = require('../config/db');

async function loggerMiddleware(req, res, next) {
  // This event listener waits for the response to finish before logging.
  // This ensures we can accurately capture the final status code.
  res.on('finish', async () => {
    try {
      // req.user is added by our authenticateToken middleware for protected routes
      const userId = req.user ? req.user.id : null;
      const userEmail = req.user ? req.user.email : null;

      await db.query(
        'INSERT INTO transaction_logs (user_id, email, endpoint, http_method, status_code) VALUES (?, ?, ?, ?, ?)',
        [userId, userEmail, req.originalUrl, req.method, res.statusCode]
      );
    } catch (error) {
      console.error('Failed to log transaction:', error);
    }
  });

  // Call next() immediately to ensure the request continues to its route handler without delay.
  next();
}

module.exports = {
  loggerMiddleware,
};