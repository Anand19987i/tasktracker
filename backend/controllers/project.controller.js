import { Project } from "../models/project.model.js";


export const createProject = async (req, res) => {
    try {
        const existingProjects = await Project.find({ user: req.user.userId });
        if (existingProjects.length >= 4) {
            return res.status(403).json({
                success: false,
                message: 'You have reached the project limit'
            })
        }
        const { name } = req.body;

        const newProject = new Project({
            name,
            user: req.user.userId
        });

        await newProject.save();
        res.status(201).json({
            success: true,
            message: 'Project created',
            project: newProject
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating project' });
    }
}

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.userId }).populate('tasks');
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching projects' });
    }
}

export const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        console.log(projectId)
        const { name } = req.body;
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.name = name || project.name;
        await project.save();

        res.status(200).json({
            success: true,
            message: 'Project updated',
            project
        });
    } catch (err) {
        res.status(500).json({ message: 'Error updating project' });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ success: true, message: 'Project deleted' });
    } catch (err) {
        console.error('Error deleting project:', err);
        res.status(500).json({ message: 'Error deleting project', error: err.message });
    }
};

export const toggleFavoriteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.isFavorite = !project.isFavorite;
        await project.save();

        res.status(200).json({
            success: true,
            message: 'Favorite status updated',
            project,
        });
    } catch (err) {
        console.error('Error toggling favorite:', err);
        res.status(500).json({ message: 'Error toggling favorite', error: err.message });
    }
};

export const getFavoriteProjects = async (req, res) => {
    try {
      const { userId }= req.params;
      const favoriteProjects = await Project.find({ 
        user: userId, 
        isFavorite: true 
      }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, projects: favoriteProjects });
    } catch (error) {
      console.error('Error fetching favorite projects:', error.message);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };