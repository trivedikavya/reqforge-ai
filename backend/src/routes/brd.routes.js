const express = require('express');
const router = express.Router();
const brdController = require('../controllers/brd.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/:projectId', brdController.getBRD);
router.post('/:projectId/generate', brdController.generateBRD);
router.put('/:projectId', brdController.updateBRD);
router.post('/:projectId/export', brdController.exportBRD);

module.exports = router;