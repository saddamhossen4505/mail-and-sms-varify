
const express = require('express');
const multer = require('multer');
const path = require('path');
const { showUnverifyStudentTable, showCreateStudentForm, CreateStudentData, showSingleData, editStudentData, updateStudentData, deleteStudentData, showAllverifyStudent, verifyAccount, verifyByPhone, verifyOtpByPhone } = require('../controllers/studentController');


// Init Multer.
const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        if( file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
            cb( null, path.join(__dirname, '../public/images/studentPhoto'));
        }
    },
    filename : (req, file, cb) => {
        cb( null, Date.now() + '_' + Math.floor(Math.random() * 10000000)+ '_' + file.originalname)
    }
});

const studentPhotoMulter = multer({
    storage : storage,
}).single('student_photo_field');


// Init Router.
const router = express.Router();

// Routers.
router.get('/', showAllverifyStudent );
router.get('/unverify', showUnverifyStudentTable );
router.get('/create', showCreateStudentForm );
router.post('/create', studentPhotoMulter, CreateStudentData );
router.get('/:id', showSingleData );
router.get('/verify/:token', verifyAccount);
router.get('/edit/:id', editStudentData );
router.post('/update/:id', studentPhotoMulter, updateStudentData );
router.get('/delete/:id', deleteStudentData );
router.get('/phone/:id', verifyByPhone);
router.post('/phone/:id', verifyOtpByPhone);



// Exports Router.
module.exports = router;