module.exports = (server) => {
    const secretSantaAssignmentController = require('../controllers/secretSantaAssignmentController');
    const { verifyToken,checkGroupOwner } = require('../middlewares/jwtMiddleware');

    server.route('/groups/:groupId/secret-santa')
        .get(verifyToken,checkGroupOwner, secretSantaAssignmentController.getAssignments)
        .post(verifyToken, checkGroupOwner,secretSantaAssignmentController.assignSecretSantas);

};
