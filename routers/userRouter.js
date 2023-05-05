const express = require('express');
const { adminLogin, adminRegister, adminGet, adminUpdate, adminPassword, adminForget, adminReset, adminDoctorUpdate, adminProfile } = require('../controllers/adminController');
const userRouter = new express.Router();
const multer = require('multer');
const  {authentication,doctor_authentication,patient_authentication} = require('../middelware/authentication');
const { treatmentGet, treatmentPost, treatmentPut, treatmentPatch, treatmentDelete } = require('../controllers/treatmentController');
const { categoryGet, categoryPost, categoryPut, categoryPatch, categoryDelete } = require('../controllers/categoryController');
const { expertiseGet, expertisePost, expertisePut, expertisePatch, expertiseDelete } = require('../controllers/expertiseController');
const { doctorGet, doctorPost, doctorDelete, doctorPut, doctorLogin, doctorPassword, doctorForget, doctorReset } = require('../controllers/doctorController');
const {patientGet, patientLogin, patientPost, patientPut, patientDelete,patientPassword,patientForget,patientReset, patientPatch} = require('../controllers/patientController');
const {appointmentGet, appointmentPost, appointmentPut, appointmentPatch, appointmentDelete,appointmentNewPost, appointmentDoctorPut, appointmentTypeGet, appointmentTypePost, appointmentTypeDelete} = require('../controllers/appointmentController');
const {reviewGet,reviewPost,reviewPut,reviewDelete} = require('../controllers/reviewController');
const {emailTemplateGet,emailTemplatePost, emailTemplateTest} = require('../controllers/emailTemplateController');
const { paymentListGet, paymentListPost } = require('../controllers/paymentController');
const { commissionGet, commissionPost, commissionDelete } = require('../controllers/commissionController');
const { settingsGet, settingsPost } = require('../controllers/settingsController');
const { roleGet, rolePost, roleDelete, roleAssign } = require('../controllers/roleController');
const { deasesGet, deasesPost, deasesPut, deasesPatch, deasesDelete } = require('../controllers/deaseController');
const { departmentGet, departmentPost, departmentPut, departmentPatch, departmentDelete } = require('../controllers/departmentController');
const { timeslotsGet, timeslotsPost, timeslotsPut, timeslotsPatch, timeslotsDelete } = require('../controllers/timeslotsController');
const { branchGet, branchPost, branchPut, branchPatch, branchDelete } = require('../controllers/branchController');
const { assigntimeslotsGet, assigntimeslotsPost, assigntimeslotsPatch, assigntimeslotsDelete, assigntimeslotsAvailableGet } = require('../controllers/calandertimeslotController');



/* section - Disk storage engien by multer  */

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/uploads`)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
     
    }
  });

 var upload = multer({ storage:storage })

/* -- section - Disk storage engien by multer ends -- */

/* -- section - home multiple image multer start -- */
   var service_profile = upload.fields([{name:'profile_image'},{name:'cover_image'}])

   /* -- section - home multiple image multer ends -- */





/* admin api router */
userRouter.post('/api/login' , adminLogin);
userRouter.get('/api/admin', authentication , adminGet);
userRouter.get('/api/admin-profile', authentication , adminProfile);
userRouter.post('/api/register' , adminRegister);
userRouter.put('/api/admin',authentication , upload.single('image'), adminUpdate);
userRouter.post('/api/admin/change-password',authentication, adminPassword);
userRouter.post('/api/admin/forget-password', adminForget);
userRouter.post('/api/admin/reset-password', adminReset);
userRouter.patch('/api/admin/doctor-update',authentication, adminDoctorUpdate);



/* treatment api router */
userRouter.get('/api/treatment' , treatmentGet);
userRouter.post('/api/treatment', upload.single('image') , authentication , treatmentPost);
userRouter.put('/api/treatment', upload.single('image') , authentication , treatmentPut);
userRouter.patch('/api/treatment', authentication , treatmentPatch);
userRouter.delete('/api/treatment', authentication , treatmentDelete);

/* category api router */
userRouter.get('/api/category' , categoryGet);
userRouter.post('/api/category', upload.single('image') , authentication , categoryPost);
userRouter.put('/api/category', upload.single('image') , authentication , categoryPut);
userRouter.patch('/api/category', authentication , categoryPatch);
userRouter.delete('/api/category', authentication , categoryDelete);

/* department api router */
userRouter.get('/api/department' , departmentGet);
userRouter.post('/api/department', upload.single('image') , authentication , departmentPost);
userRouter.put('/api/department', upload.single('image') , authentication , departmentPut);
userRouter.patch('/api/department', authentication , departmentPatch);
userRouter.delete('/api/department', authentication , departmentDelete);


/* expertise api router */
userRouter.get('/api/expertise' , expertiseGet);
userRouter.post('/api/expertise', upload.single('image') , authentication , expertisePost);
userRouter.put('/api/expertise', upload.single('image') , authentication , expertisePut);
userRouter.patch('/api/expertise', authentication , expertisePatch);
userRouter.delete('/api/expertise', authentication , expertiseDelete);

/* deases api router */
userRouter.get('/api/disease' , deasesGet);
userRouter.post('/api/disease', upload.single('image') , authentication , deasesPost);
userRouter.put('/api/disease', upload.single('image') , authentication , deasesPut);
userRouter.patch('/api/disease', authentication , deasesPatch);
userRouter.delete('/api/disease', authentication , deasesDelete);

/* doctor api router */
userRouter.get('/api/doctor', doctorGet);
userRouter.post('/api/doctor/login' , doctorLogin);
userRouter.post('/api/doctor/register',upload.single('image'), authentication , doctorPost);
userRouter.put('/api/doctor/by-token' ,upload.single('image'), doctorPut);
userRouter.put('/api/doctor', upload.single('image') , doctor_authentication , doctorPut);
userRouter.put('/api/admin/doctor', upload.single('image') , authentication , doctorPut);
userRouter.delete('/api/doctor', authentication , doctorDelete);
userRouter.post('/api/doctor/change-password', doctor_authentication , doctorPassword);
userRouter.post('/api/doctor/forget-password', doctorForget);
userRouter.post('/api/doctor/reset-password', doctorReset);

/* appointment api router */
userRouter.get('/api/appointment' , appointmentGet);
userRouter.post('/api/appointment', authentication  , appointmentPost);
userRouter.post('/api/new-appointment', authentication  , appointmentNewPost);
userRouter.put('/api/appointment', authentication  , appointmentPut);
userRouter.put('/api/doctor/appointment', doctor_authentication , appointmentDoctorPut);
userRouter.patch('/api/appointment', authentication  , appointmentPatch);


/* appointment api router */
userRouter.get('/api/appointment-type' , appointmentTypeGet);
userRouter.post('/api/appointment-type' , appointmentTypePost);
userRouter.delete('/api/appointment-type' , appointmentTypeDelete);



/* patient api router */
userRouter.get('/api/patient' , patientGet);
userRouter.post('/api/patient/login' , patientLogin);
userRouter.post('/api/patient/register', upload.single('image') , authentication , patientPost);
// userRouter.put('/api/patient', upload.single('image') , doctor_authentication , patientPut);
userRouter.put('/api/patient', upload.single('image') , authentication , patientPut);
userRouter.patch('/api/patient', authentication , patientPatch);
userRouter.delete('/api/patient', authentication , patientDelete);
userRouter.post('/api/patient/change-password', doctor_authentication , patientPassword);
userRouter.post('/api/patient/forget-password', patientForget);
userRouter.post('/api/patient/reset-password', patientReset);

/* review api router */
userRouter.get('/api/review' , reviewGet);
userRouter.post('/api/review',patient_authentication , reviewPost);
userRouter.put('/api/review',authentication , reviewPut);
userRouter.delete('/api/review', authentication , reviewDelete);



/* emailTemplate api router */
userRouter.get('/api/email' , emailTemplateGet);
userRouter.post('/api/email',authentication , emailTemplatePost);
userRouter.get('/api/test-email',authentication , emailTemplateTest);

/* paymentList api router */
userRouter.get('/api/payment-list' , paymentListGet);
userRouter.post('/api/payment-list',authentication , paymentListPost);

/* comission api router  */
userRouter.get('/api/commission', commissionGet);
userRouter.post('/api/commission', commissionPost);
userRouter.delete('/api/commission', commissionDelete);


/* settings api router  */
userRouter.get('/api/settings', settingsGet);
userRouter.post('/api/settings', upload.single('logo') , settingsPost);

/* role api router  */
userRouter.get('/api/role',authentication , roleGet);
userRouter.post('/api/role',authentication , rolePost);
userRouter.post('/api/role-assign',authentication , roleAssign);
userRouter.delete('/api/role',authentication , roleDelete);


/* timeslots api router */
userRouter.get('/api/timeslots' , timeslotsGet);
userRouter.post('/api/timeslots',authentication , timeslotsPost);
userRouter.put('/api/timeslots',authentication , timeslotsPut);
userRouter.patch('/api/timeslots', authentication , timeslotsPatch);
userRouter.delete('/api/timeslots', authentication , timeslotsDelete);

/* assigntimeslots api router */
userRouter.get('/api/assigntimeslots' , assigntimeslotsGet);
userRouter.get('/api/availableslots' , assigntimeslotsAvailableGet);
userRouter.post('/api/assigntimeslots',authentication , assigntimeslotsPost);
userRouter.patch('/api/assigntimeslots', authentication , assigntimeslotsPatch);
userRouter.delete('/api/assigntimeslots', authentication , assigntimeslotsDelete);

/* branch api router */
userRouter.get('/api/branch' , branchGet);
userRouter.post('/api/branch',authentication , branchPost);
userRouter.put('/api/branch',authentication , branchPut);
userRouter.patch('/api/branch', authentication , branchPatch);
userRouter.delete('/api/branch', authentication , branchDelete);



module.exports = userRouter;