module.exports = (server) => {
    const membershipController = require('../controllers/membershipController');
    const { verifyToken } = require('../middlewares/jwtMiddleware'); 

    server.route('/groups/:groupId/members')
        .post(verifyToken, membershipController.addMember)
        .get(verifyToken, membershipController.getGroupMembers);  

    server.route('/groups/:groupId/members/:userId')
        .put(verifyToken, membershipController.updateMemberStatus) 
        .delete(verifyToken, membershipController.removeMember);
};
