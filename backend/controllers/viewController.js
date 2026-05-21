const Task = require('../models/Task');
const User = require('../models/User');

exports.getIndex = (req, res) => res.render('index');
exports.getLogin = (req, res) => res.render('login', { error: req.query.error, success: req.query.success });
exports.getSignup = (req, res) => res.render('signup', { error: req.query.error });
exports.getLogout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};
exports.getManagerDashboard = async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email').populate('createdBy', 'name').sort({createdAt: -1}).lean();
        const employees = await User.find({ role: 'employee' }).select('name email').lean();
        res.render('manager', { tasks, employees, userName: req.user.name, error: req.query.error });
    } catch (err) {
        console.error(err);
        res.render('manager', {error: 'Server error while loading dashboard' , tasks: [], employees: [] });
    }
};

exports.getEmployeeDashboard = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user.userId }).populate('createdBy', 'name').sort({createdAt: -1}).lean();
        res.render('employee', { tasks, userName: req.user.name, error: req.query.error });
    } catch (err) {
        console.error(err);
        res.render('employee', {error: 'Server error while loading dashboard' , tasks: [] });
    }
};
