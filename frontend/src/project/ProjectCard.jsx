import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit2, Plus, StarIcon } from 'lucide-react';
import { FaStar } from "react-icons/fa";
import axios from 'axios';
import { PROJECT_API_END_POINT, TASK_API_END_POINT } from '../utils/utils';

const ProjectCard = ({ project, onDelete, onEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [updatedName, setUpdatedName] = useState(project.name);
  const [isFavorite, setIsFavorite] = useState(project.isFavorite);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'pending',
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${PROJECT_API_END_POINT}/delete/project/${project._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      onDelete(project._id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete project');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `${PROJECT_API_END_POINT}/update/project/${project._id}`,
        { name: updatedName },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      onEdit(data.project);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update project');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${TASK_API_END_POINT}/create-task`,
        {
          ...newTask,
          projectId: project._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      onEdit(data.project);
      setNewTask({ title: '', description: '', deadline: '', status: 'pending' });
      setIsAddTaskModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to add task');
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      setIsFavorite(!isFavorite); // optimistic update
      await axios.put(
        `${PROJECT_API_END_POINT}/toggle-favorite/${project._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      onEdit && onEdit();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setIsFavorite(isFavorite); // revert on error
      alert('Failed to toggle favorite');
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 mb-6 relative">

      {/* Project Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 truncate">{project.name}</h3>
          {project.createdAt && (
            <p className="text-xs text-gray-500 mt-1">Created on: {formatDate(project.createdAt)}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={handleFavoriteToggle} className="text-yellow-500 hover:text-yellow-600 p-1 rounded-lg hover:bg-yellow-50">
            {isFavorite ? <FaStar size={18} /> : <StarIcon size={18} />}
          </button>
          <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:text-blue-500 p-1 rounded-lg hover:bg-blue-50">
            <Edit2 size={18} />
          </button>
          <button onClick={handleDelete} className="text-red-600 hover:text-red-500 p-1 rounded-lg hover:bg-red-50">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Task Summary */}
      <p className="text-sm font-medium text-gray-800 mb-4">
        {project?.tasks?.length} task{project?.tasks?.length !== 1 && 's'}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Link to={`/project/${project._id}`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center transition-colors">
          View Details
        </Link>
        <button onClick={() => setIsAddTaskModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2 transition-colors">
          <Plus size={18} />
          Add New Task
        </button>
      </div>

      {/* Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Edit Project</h3>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="w-full p-2 mb-4 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new project name"
                required
              />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
            <form onSubmit={handleAddTask}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none h-24"
                  placeholder="Enter task description"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddTaskModalOpen(false);
                    setNewTask({ title: '', description: '', deadline: '', status: 'pending' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md  hover:bg-blue-700"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
