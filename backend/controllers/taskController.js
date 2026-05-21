const Task = require('../models/Task');
const User = require('../models/User');

exports.createTask = async (req, res) => {
    try {
        const { title, description, deadline, assignedTo } = req.body;
        if (!title || !assignedTo) {
            return res.status(400).json({ message: 'Title and assignedTo are required' });
        }
        const employee = await User.findById(assignedTo);
        if (!employee || employee.role !== 'employee') {
            return res.status(400).json({ message: 'Assigned user must be an employee' });
        }
        const task = new Task({
            title,
            description,
            deadline,
            assignedTo,
            createdBy: req.user.userId
        });
        const savedTask = await task.save();
        res.redirect('/manager');
    } catch (err) {
        console.error(err);
        res.redirect('/manager?error=Servererrorwhilecreatingtask');
    }
};

exports.getTasks = async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'manager') {
            tasks = await Task.find().populate('assignedTo', 'name email').populate('createdBy', 'name email').sort({createdAt: -1});
        } else {
            tasks= await Task.find({ assignedTo: req.user.userId }).populate('createdBy', 'name email').sort({createdAt: -1});
        }
        res.status(200).json({ tasks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while fetching tasks' });
    }
};
exports.updateTask = async (req, res) => {
    try {
        const task= await Task.findById(req.params.id);
        if (!task){
            return res.status(404).json({message:'Task not found'});
        }
        if (req.user.role === 'manager'){
            const { title, description, deadline, assignedTo, status } = req.body;
            if (title) task.title = title;
            if (description) task.description = description;
            if (deadline) task.deadline = deadline;
            if (assignedTo) task.assignedTo = assignedTo;
            if (status) task.status = status;
        }
        else {
            if (task.assignedTo.toString() !== req.user.userId){
                return res.status(403).json({message:'Access denied. You can only update your own tasks.'});
            }
            if (req.body.status) task.status = req.body.status;
        }
        const updatedTask = await task.save();
        const dest = req.user.role === 'manager' ? '/manager' : '/employee';
        res.redirect(dest);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Server error while updating task'});
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.redirect('/manager');
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while deleting task' });
    }   
};