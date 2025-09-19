import db from '../config/db.js';

export async function loggerMiddleware(req, res, next) {
  res.on('finish', async () => {
    try {
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
  
  next();
}