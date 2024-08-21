// routes/groupRoutes.js
module.exports = (server) => {
    const groupController = require('../controllers/groupController');
    const { verifyToken } = require('../middlewares/jwtMiddleware'); 

    server.route('/groups')
        .post(verifyToken, groupController.createGroup)    
        .get(verifyToken, groupController.getListGroups);      

    server.route('/groups/:group_id')
        .get(verifyToken, groupController.getGroup)       
        .put(verifyToken, groupController.updateGroup)     
        .delete(verifyToken, groupController.deleteGroup);
};
