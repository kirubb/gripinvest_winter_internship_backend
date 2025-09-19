import express from 'express'
import productController from '../controllers/product.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', authenticateToken, productController.getAll)
router.post('/', authenticateToken, productController.create)

router.get('/recommendations', authenticateToken, productController.getRecommendations)

router.get('/:id', authenticateToken, productController.getOne)
router.put('/:id', authenticateToken, productController.update)
router.delete('/:id', authenticateToken, productController.remove)

export default router