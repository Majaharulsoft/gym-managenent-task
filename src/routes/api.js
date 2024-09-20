const express=require('express');
import { register, login } from '../controllers/authController';
import { createClass, bookClass } from '../controllers/classController';
const authMiddleware= require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

const InvoiceController = require("../controllers/InvoiceController");
const FeaturesController = require("../controllers/FeaturesController");

router.post('/create', authMiddleware, createClass);
router.post('/book', authMiddleware, bookClass);

module.exports=router;

