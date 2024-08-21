const jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_KEY;
const Group = require('../models/groupModel');

exports.verifyToken = async (req,res, next) => {
    try {
        const token = req.headers['authorization'];
        if(token != undefined) {
            const payload = await new Promise((resolve, reject) => {
                jwt.verify(token, jwtKey, (error, decoded) =>{
                    if(error){
                        reject(error);
                    } else {
                        resolve(decoded);
                    }
                });
            });
            req.user = payload;
            next();
        } else {
            res.status(403).json({message: 'Accès interdit: token manquant'});
        }
    } catch (error) {
        console.log(error);
        res.status(403).json({message: 'Accès interdit: token invalide'});
    }
}

exports.checkGroupOwner = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id; 

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }

        if (group.ownerId.toString() !== userId) {
            return res.status(403).json({ message: 'Accès interdit: vous n\'êtes pas le créateur du groupe' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};