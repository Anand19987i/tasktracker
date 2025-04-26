import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";


export const createTask = async (req, res) => {
    try {
        const { title, description, status, projectId } = req.body;
        const task = new Task({
            title,
            description,
            status,
            user: req.user.userId,
            project: projectId
        })

        await task.save();

        if (projectId) {
            await Project.findByIdAndUpdate(projectId, {
                $push: { tasks: task._id }
            });
        }
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            task
        })
    } catch (err) {
        console.error('Create Task Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.userId }).populate('project');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({
            success: true,
            message: 'Error fetching tasks'
        });
    }
}

export const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const updateData = req.body;

        if (updateData.status === 'completed') {
            updateData.completedAt = new Date();
        }

        const updatedTask = await Task.findOneAndUpdate(
            {
                _id: taskId,
                user: req.user.userId
            },
            updateData,
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            })
        }
        res.status(200).json({
            message: 'Task Updated',
            task: updatedTask
        })
    } catch (err) {
        res.status(500).json({ 
            message: 'Error updating task' 
        });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        const deletedTask = await Task.findOneAndDelete({
            _id: taskId,
            user: req.user.userId
        });

        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            })
        }

        if (deletedTask.project) {
            await Project.findByIdAndUpdate(deletedTask.project, {
                $pull: { tasks: taskId }
            });
        }
        res.status(200).json({
            success: true,
            message: 'Task deleted'
        })
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
}

