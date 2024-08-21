module.exports = (server) => {
    const userController = require('../controllers/userController');
    const { verifyToken } = require('../middlewares/jwtMiddleware'); 

    server.route('/register')
        .post(userController.userRegister);

    server.route('/login')
        .post(userController.userLogin);

    server.route('/users/:user_id')
        .get(verifyToken, userController.getUser)
        .put(verifyToken, userController.modifyUser)
        .delete(verifyToken, userController.deleteUser);
};
