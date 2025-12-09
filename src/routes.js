const express = require('express');
const AreaController = require('./controllers/areaController');
const AuthController = require('./controllers/authController');
const ContactController = require('./controllers/contactController');
const GameController = require('./controllers/gameController');
const JourneyController = require('./controllers/journeyController');
const UserController = require('./controllers/userController');
const { verifyToken } = require('./middlewares/authMiddleware');
const upload = require('./config/multer');

const router = express.Router();

// Rotas Autenticação
router.post('/auth/register', UserController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/forgot-password', AuthController.forgotPassword);
router.post('/auth/reset-password/', AuthController.resetPassword);
router.post('/auth/logout', verifyToken, AuthController.logout);

// Rotas de Game
router.get('/journeys/:journeyId/games', verifyToken, GameController.edit);
router.put('/journeys/:journeyId/games', verifyToken, GameController.update);

// Rotas de Journey
router.get('/users/:userId/files/:fileName', JourneyController.sendImage);
router.get('/journeys', JourneyController.listAll);
router.get('/journeys/:journeyId', JourneyController.view);
router.get('/users/:userId/journey-exports/:journeyId', JourneyController.download);
router.get('/users/:userId/journeys', verifyToken, UserController.index);
router.post('/journeys', 
    verifyToken, 
    upload.single('imageData'),
    JourneyController.store
);
router.put('/journeys/:journeyId', 
  verifyToken, 
  upload.single('imageData'),
  JourneyController.update
);
router.delete('/journeys/:journeyId', verifyToken, JourneyController.destroy);

//Outras
router.get('/areas', AreaController.index);
router.post('/contacts', ContactController.submit);

module.exports = router;