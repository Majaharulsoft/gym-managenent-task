const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  bcrypt.hash(password, 10, function (err, hashedPassword) {
    if (err) {
      return res.status(500).json({ message: 'Error registering user', error: err });
    }
    const user = new User({ name: name, email: email, password: hashedPassword, role: role });

    user.save(function (err, savedUser) {
      if (err) {
        return res.status(500).json({ message: 'Error registering user', error: err });
      }
      res.status(201).json({ message: 'User registered successfully', user: savedUser });
    });
  });
};

exports.login = function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }, function (err, user) {
    if (err || !user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    bcrypt.compare(password, user.password, function (err, isMatch) {
      if (err || !isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful', token: token });
    });
  });
};
