const Membership = require("../models/membershipModel");
const Group = require("../models/groupModel");
const User = require("../models/userModel");

exports.addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const existingMembership = await Membership.findOne({
      userId: user._id,
      groupId,
    });
    if (existingMembership) {
      return res
        .status(400)
        .json({ message: "Utilisateur déjà membre du groupe ou déjà invité" });
    }

    const membership = new Membership({
      userId: user._id,
      groupId,
      isAccepted: false,
    });

    await membership.save();

    // Envoyer l'email d'invitation
    const group = await Group.findById(groupId); // Trouver le groupe pour l'inclure dans l'email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Invitation à rejoindre un groupe Secret Santa",
      text: `Bonjour,

        Vous avez été invité à rejoindre le groupe "${group.name}" sur l'application Secret Santa.

        Veuillez vous connecter pour accepter l'invitation et voir les détails du groupe.

        Cordialement,
        L'équipe Secret Santa`,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "Invitation envoyée", membership });
  } catch (error) {
    res.status(500).json({ message: "Erreur add member", error });
  }
};

exports.getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;

    const members = await Membership.find({ groupId }).populate(
      "userId",
      "username email"
    );
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Erreur get group members", error });
  }
};

exports.updateMemberStatus = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const { isAccepted } = req.body;

    const membership = await Membership.findOne({ userId, groupId });
    if (!membership) {
      return res
        .status(404)
        .json({ message: "Membre non trouvé dans ce groupe" });
    }

    membership.isAccepted = isAccepted;
    membership.updatedAt = Date.now();

    await membership.save();
    res.status(200).json(membership);
  } catch (error) {
    res.status(500).json({ message: "Erreur update member status", error });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    const membership = await Membership.findOneAndDelete({ userId, groupId });
    if (!membership) {
      return res
        .status(404)
        .json({ message: "Membre non trouvé dans ce groupe" });
    }

    res.status(200).json({ message: "Membre supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur delete member of Group", error });
  }
};
