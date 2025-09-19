import db from '../config/db.js';



async function summarizeLogsByUserId(userId) {
  const [rows] = await db.query('SELECT status_code FROM transaction_logs WHERE user_id = ?', [userId]);
  
  const totalRequests = rows.length;
  const successfulRequests = rows.filter(log => log.status_code < 400).length;
  const failedRequests = totalRequests - successfulRequests;

  const summary = `AI analysis complete: You have made ${totalRequests} total API requests. ${successfulRequests} were successful, and ${failedRequests} resulted in an error.`;
  
  return { summary, totalRequests, successfulRequests, failedRequests };
}

async function summarizeErrorsByUserId(userId) {
  const [errorRows] = await db.query(
    'SELECT endpoint, COUNT(*) as error_count FROM transaction_logs WHERE user_id = ? AND status_code >= 400 GROUP BY endpoint ORDER BY error_count DESC',
    [userId]
  );

  if (errorRows.length === 0) {
    return { summary: 'AI analysis found no error patterns in your recent activity. Great job!' };
  }

  const mostCommonError = errorRows[0];
  const summary = `AI has detected patterns in your errors. The most common error occurs at the '${mostCommonError.endpoint}' endpoint (${mostCommonError.error_count} times).`;
  
  return { summary, details: errorRows };
}

async function findByUserId(userId) {
  const [rows] = await db.query(
    'SELECT endpoint, http_method, status_code, created_at FROM transaction_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [userId]
  );
  return rows;
}

async function findByEmail(email) {
  const [rows] = await db.query(
    'SELECT endpoint, http_method, status_code, created_at FROM transaction_logs WHERE email = ? ORDER BY created_at DESC LIMIT 50',
    [email]
  );
  return rows;
}

export default {
  findByUserId,
  findByEmail,
  summarizeLogsByUserId,
  summarizeErrorsByUserId,
};