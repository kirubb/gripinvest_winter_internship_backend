import logService from '../services/log.service.js';

async function getMyLogs(req, res) {
  try {
    const logs = await logService.findByUserId(req.user.id);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs' });
  }
}

async function getLogSummary(req, res) {
  try {
    const summary = await logService.summarizeLogsByUserId(req.user.id);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching log summary' });
  }
}

async function getErrorSummary(req, res) {
  try {
    const summary = await logService.summarizeErrorsByUserId(req.user.id);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching error summary' });
  }
}
async function searchLogsByEmail(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const logs = await logService.findByEmail(email);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs by email' });
  }
}


export default {
  searchLogsByEmail,
  getMyLogs,
  getLogSummary,
  getErrorSummary,
};