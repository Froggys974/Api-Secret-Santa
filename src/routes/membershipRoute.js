module.exports = (server) => {
    const membershipController = require('../controllers/membershipController');
    const { verifyToken,checkGroupOwner } = require('../middlewares/jwtMiddleware'); 

    server.route('/groups/:groupId/members')
        .get(verifyToken, membershipController.getGroupMembers)
        .post(verifyToken, checkGroupOwner,membershipController.addMember);

    server.route('/groups/:groupId/members/:userId')
        .put(verifyToken,checkGroupOwner, membershipController.updateMemberStatus) 
        .delete(verifyToken, checkGroupOwner,membershipController.removeMember);
};
