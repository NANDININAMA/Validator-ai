const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, expertData } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Determine user role
    // Respect explicit role from client when provided ('admin' | 'expert' | 'user').
    // Fallback to default 'user' if not specified.
    let userRole = 'user';
    if (role === 'admin') {
      userRole = 'admin';
    } else if (role === 'expert') {
      userRole = 'expert';
    }

    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: userRole
    });
    await user.save();

    // If expert registration, create expert profile
    if (userRole === 'expert' && expertData) {
      // Validate expert data
      if (!expertData.specialization || !expertData.experience || !expertData.bio || 
          !expertData.profession || !expertData.linkedin || !expertData.expertise || 
          expertData.expertise.length === 0) {
        return res.status(400).json({ message: "All expert fields are required" });
      }

      const Expert = require('../models/Expert');
      const expert = new Expert({
        user: user._id,
        specialization: expertData.specialization,
        experience: expertData.experience,
        bio: expertData.bio,
        expertise: expertData.expertise,
        profession: expertData.profession,
        linkedin: expertData.linkedin,
        location: expertData.location || '',
        isVerified: false, // Requires admin verification
        verificationNotes: 'Pending verification'
      });
      await expert.save();
    }

    // Generate token for immediate login
    const token = generateToken(user._id);
    res.status(201).json({ 
      message: "User created", 
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    return res.json({ 
      user: { id: user._id, email: user.email, name: user.name, role: user.role }, 
      token: token 
    });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ user });
  } catch (err) {
    console.error('getProfile error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ 
      message: 'Profile updated successfully',
      user 
    });
  } catch (err) {
    console.error('updateProfile error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('changePassword error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
