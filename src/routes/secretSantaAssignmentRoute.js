module.exports = (server) => {
    const secretSantaController = require('../controllers/secretSantaController');
    const { verifyToken } = require('../middlewares/jwtMiddleware');

    server.route('/groups/:groupId/secret-santa')
        .post(verifyToken, secretSantaController.assignSecretSantas);

    server.route('/groups/:groupId/secret-santa')
        .get(verifyToken, secretSantaController.getAssignments);
};
