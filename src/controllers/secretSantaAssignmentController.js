const SecretSantaAssignment = require('../models/secretSantaAssignmentModel');
const Membership = require('../models/membershipModel');
const User = require('../models/userModel');
const Group = require('../models/groupModel');
const transporter = require('../utils/emailConfig'); 

function assignSecretSantas(members) {
    const assignments = [];
    const shuffledMembers = [...members].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < shuffledMembers.length; i++) {
        const giver = shuffledMembers[i];
        const receiver = shuffledMembers[(i + 1) % shuffledMembers.length];
        assignments.push({ giverId: giver._id, receiverId: receiver._id });
    }
    
    return assignments;
}

exports.assignSecretSantas = async (req, res) => {
    try {
        const { groupId } = req.params;
        
        const memberships = await Membership.find({ groupId, isAccepted: true }).populate('userId');
        const members = memberships.map(m => m.userId);

        if (members.length < 2) {
            return res.status(400).json({ message: 'Pas assez de membres pour effectuer l\'assignation' });
        }

        const assignments = assignSecretSantas(members);

        await SecretSantaAssignment.deleteMany({ groupId }); 
        await SecretSantaAssignment.insertMany(assignments.map(a => ({
            ...a,
            groupId
        })));

        for (const assignment of assignments) {
            const giver = await User.findById(assignment.giverId);
            const receiver = await User.findById(assignment.receiverId);
            const group = await Group.findById(groupId);

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: giver.email,
                subject: 'Votre affectation Secret Santa',
                text: `Bonjour ${giver.username},

                Vous avez été assigné pour offrir un cadeau à ${receiver.username} dans le groupe "${group.name}" sur l'application Secret Santa.

                Rappel : Ne dites à personne qui est votre destinataire !

                Cordialement,
                L'équipe Secret Santa`
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(200).json({ message: 'Assignations de Secret Santa effectuées avec succès', assignments });
    } catch (error) {
        res.status(500).json({ message: 'Erreur d\'assignation Secret Santa', error });
    }
};

exports.getAssignments = async (req, res) => {
    try {
        const { groupId } = req.params;

        const assignments = await SecretSantaAssignment.find({ groupId }).populate('giverId receiverId');
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des assignations', error });
    }
};
