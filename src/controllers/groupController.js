const Group = require('../models/groupModel');
const Membership = require('../models/membershipModel');
const User = require('../models/userModel');


exports.createGroup = async (req, res) => {
    try {
        const newGroup = new Group({
            name: req.body.name,
            ownerId: req.user.id 
        });

        const group = await newGroup.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Erreur create group', error });
    }
};

exports.getListGroups = async (req, res) => {
    try {
        const groups = await Group.find({ ownerId: req.user.id }); 
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Erreur get list group', error });
    }
};

exports.getGroup = async (req, res) => {
    try {
        const groupId = req.params.group_id;
        const userId = req.user.id;
        const group = await Group.findById(groupId);
        const user = await User.findById(userId);


        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }
        const membership = await Membership.findOne({ groupId, userId });
        
        if (!membership || !membership.isAccepted) {
            return res.status(403).json({ message: 'Accès interdit' });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du groupe', error });
    }
};


exports.updateGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.group_id);

        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }

        if (group.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Accès interdit' });
        }

        group.name = req.body.name || group.name;
        group.updatedAt = Date.now();

        const updatedGroup = await group.save();
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: 'Erreur update group', error });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.group_id);

        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }

        if (group.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Accès interdit' });
        }

        await group.remove();
        res.status(200).json({ message: 'Groupe supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur delete group', error });
    }
};
