const router = require('express').Router();
const protect = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

const{
    getIndex,getLogin,getSignup,getManagerDashboard,getEmployeeDashboard,getLogout
    } = require('../controllers/viewController');

router.get('/', getIndex);
router.get('/login', getLogin);
router.get('/signup', getSignup);
router.get('/logout', getLogout);

router.get('/manager', protect, checkRole('manager'), getManagerDashboard);
router.get('/employee', protect, checkRole('employee'), getEmployeeDashboard);

module.exports = router;