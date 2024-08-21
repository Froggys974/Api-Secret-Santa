const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.userRegister = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        const user = await newUser.save();
        // const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_KEY, { expiresIn: '10h' });

        res.status(201).json({ message: `Utilisateur créé: ${user.email}`});
    } catch (error) {
        res.status(500).json({ message: 'Erreur register', error });
    }
};

exports.userLogin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!user || !isMatch) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_KEY, { expiresIn: '10h' });

        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Erreur login', error });
    }
};

exports.modifyUser = async (req, res) => {
    try {
      const userId = req.params.user_id;
      const updates = req.body;
        
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true
      });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.user_id;    

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.deleteUser = async (req, res) => {
    try {
      const userId = req.params.user_id;
  
      const user = await User.findByIdAndDelete(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
