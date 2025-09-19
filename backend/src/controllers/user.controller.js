import userService from '../services/user.service.js';

async function getProfile(req, res) {
  try {
    const user = await userService.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
}

async function updateProfile(req, res) {
  try {
    const updatedUser = await userService.updateProfile(req.user.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
}

export default {
  getProfile,
  updateProfile,
};