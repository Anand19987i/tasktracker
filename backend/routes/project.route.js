import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { createProject, deleteProject, getFavoriteProjects, getProjects, toggleFavoriteProject, updateProject } from "../controllers/project.controller.js";


const router = Router();

router.post('/create', auth, createProject);
router.get("/get-projects", auth, getProjects);
router.put('/update/project/:projectId', auth, updateProject);
router.delete('/delete/project/:projectId', auth, deleteProject);
router.put('/toggle-favorite/:projectId', auth, toggleFavoriteProject);
router.get('/favourite/:userId', auth, getFavoriteProjects);

export default router;