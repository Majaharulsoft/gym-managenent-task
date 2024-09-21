const express=require('express');
const { register, login } =require('../controllers/authController') ;
const { createClass, bookClass,classlists,updateClass,deleteClass,
    getBookedClasses,deleteBookedClass} = require('../controllers/classController') ;   
const {createTrainerProfile, getAllTrainers,updateTrainerProfile,deleteTrainerProfile } =require('../controllers/trainerController') ;
const authMiddleware= require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/createClass', authMiddleware, createClass);
router.get('/classLists', authMiddleware, classlists);
router.put('/updateClass/:id', authMiddleware, updateClass);
router.delete('/deleteClass/:id', authMiddleware, deleteClass);

router.post('/bookClass', authMiddleware, bookClass);
router.get('/myClass', authMiddleware, getBookedClasses);
router.delete('/deleteMyClass', authMiddleware, deleteBookedClass);

router.post('/createTrainer', authMiddleware, createTrainerProfile);
router.get('/trainerList', authMiddleware, getAllTrainers);
router.put("/updateTrainers/:id", authMiddleware,updateTrainerProfile);
router.delete("/deleteTrainer/:id", authMiddleware,deleteTrainerProfile);

module.exports=router;

