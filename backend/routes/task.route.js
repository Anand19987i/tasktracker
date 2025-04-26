import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/task.controller.js";

const router = Router();

router.post('/create-task', auth, createTask);
router.get('/get-task', auth, getTasks);
router.put('/task/update/:id', auth, updateTask);
router.delete('/task/delete/:id', auth, deleteTask)


export default router;

