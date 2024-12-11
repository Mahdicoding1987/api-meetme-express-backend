const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })


const SALT_LENGTH = 12;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // files will be saved in 'uploads' directory
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname) // unique filename
    }
  })
  
  const upload = multer({ storage: storage })

  const updateUser = async (userId, updateData) => {
    try {
      const result = await User.findByIdAndUpdate(userId, updateData, {new: true});
      console.log('Update result:', result);
      return result;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }
  
  router.post('/upload', upload.single('image'), async (req, res) => {
    try {
      const imageUrl = `/uploads/${req.file.filename}` // This will be your local image path
      res.json({ imageUrl })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

router.put('/:id/avatar', upload.single('avatar'), async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { avatar: req.file.path },
        { new: true }
      )
      res.json(user)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  })

  router.put('/update/:id', async (req, res) => {
    console.log('Received update data:', req.body);
    console.log('User ID:', req.params.id);
  });

router.post('/signup', async (req, res) => {
    try {
        // Check if the username is already taken
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
            return res.json({error: 'Username already taken.'});
        }
        // Create a new user with hashed password
        const user = await User.create({
            username: req.body.username,
            hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH),
            age: req.body.age,
            gender: req.body.gender,
            country: req.body.country,
            bio: req.body.bio,
            avatar: req.body.avatar
        })
        const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
            const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET);
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: 'Invalid username or password.' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.json(user)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
module.exports = router;