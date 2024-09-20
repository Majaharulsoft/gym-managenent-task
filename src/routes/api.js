const express=require('express');
const { register, login } =require('../controllers/authController') ;
const { createClass, bookClass } = require('../controllers/classController') ;
const authMiddleware= require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/create', authMiddleware, createClass);
router.post('/book', authMiddleware, bookClass);

module.exports=router;

