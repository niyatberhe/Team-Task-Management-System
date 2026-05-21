const router=require('express').Router();
const {createTask,getTasks,updateTask,deleteTask}=require('../controllers/taskController');
const protect=require('../middleware/auth');
const checkRole=require('../middleware/checkRole');

router.use(protect);

router.post('/',checkRole('manager'),createTask);
router.get('/',getTasks);
router.put('/:id',updateTask);
router.delete('/:id',checkRole('manager'),deleteTask);

module.exports=router;
