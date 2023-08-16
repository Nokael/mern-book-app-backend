const express = require('express')
const User = require('../models/User');
const Book = require('../models/Book')
const asyncHandler = require('express-async-handler');
const generateToken = require('../utility/generateToken');
const authMiddleware = require('../middleWares/authMiddleware');
// const { findById } = require('../models/Book');

const userRoutes = express.Router();

//register user
userRoutes.post('/register', asyncHandler( async(req, res) => {
    const {name, email, password} = req.body;

    const userExists = await User.findOne({email: email});
    if (userExists) {
        throw new Error('User exists')
    } 
        const userCreated  = await User.create({name, email, password})
    
        res.json({
            _id: userCreated._id, 
            name: userCreated.name,
            email: userCreated.email,
            password: userCreated.password,
            token: generateToken(userCreated._id)
        });
}))


//login user
userRoutes.post('/login', asyncHandler( async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (user && (await user.isPasswordMatch(password))) {
        res.status(200);
        res.json({
            _id: user._id, 
            name: user.name,
            email: user.email,
            password: user.password,
            token: generateToken(user._id)
        });

    } else {
        res.status(401);
        throw new Error('invalid credentials');
    }
})
);

//update user
userRoutes.put(
  '/update',
  authMiddleware,
  asyncHandler(async (req, res) => {
    //Find the login user by ID
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password || user.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: generateToken(updatedUser._id),
      });
    }
  })
);


//fetch Users
userRoutes.get(
'/',
authMiddleware,
asyncHandler(async (req, res) => {
    const users = await User.find({});

    if (users) {
    res.status(200).json(users);
    } else {
    res.status(500);

    throw new Error('No users found at the moment');
    }
})
);
  

  //Delete user
userRoutes.delete('/:id', (req, res) => {
    res.send('Delete route');
  });
  

  //user profile
  userRoutes.get('/profile', authMiddleware, asyncHandler(async(req, res) => {
    try {
      const user = await User.findById(req.user._id).populate('books')

      if(!user) throw new Error("You don't have any profile yet.")
      
      res.status(200).send(user)

    } catch (error) {
      res.status(500)
      throw new Error("Server error")
    }
  })); 

module.exports = userRoutes;