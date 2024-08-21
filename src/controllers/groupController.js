const Group = require('../models/groupModel');

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
        const group = await Group.findById(req.params.group_id);

        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }

        if (group.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Accès interdit' });
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Erreur get group', error });
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
