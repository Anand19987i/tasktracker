import React, { useState } from 'react';
import { CheckCircle, Clock, Loader2, Edit2, Trash2, X, Clock2 } from 'lucide-react';
import axios from 'axios';
import { TASK_API_END_POINT } from '../utils/utils';

const statusColors = {
  pending: 'bg-yellow-400',
  'in-progress': 'bg-blue-500',
  completed: 'bg-green-500',
};

const statusIcons = {
  pending: <Clock className="w-4 h-4 text-yellow-500" />,
  'in-progress': <Clock2 className="w-4 h-4 text-blue-500 animate-spin" />,
  completed: <CheckCircle className="w-4 h-4 text-green-500" />,
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const TaskCard = ({ task, refreshTasks }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
  });
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${TASK_API_END_POINT}/task/delete/${task._id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        refreshTasks();
      } catch (err) {
        console.error('Error deleting task', err);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${TASK_API_END_POINT}/task/update/${task._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setShowModal(false);
      refreshTasks();
    } catch (err) {
      console.error('Error updating task', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition relative min-h-[260px] flex flex-col justify-between">
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button onClick={() => setShowModal(true)} className="text-blue-500 hover:text-blue-700">
            <Edit2 size={18} />
          </button>
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
            <Trash2 size={18} />
          </button>
        </div>

        {/* Task Content */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">{task.title}</h3>
          <p className="text-sm text-slate-600 mb-2 line-clamp-3">{task.description}</p>

          {/* Dates */}
          <div className="text-xs text-gray-400 space-y-1">
            {task.createdAt && <p>Created: {formatDate(task.createdAt)}</p>}
            {task.status === 'completed' && task.completedAt && (
              <p>Completed: {formatDate(task.completedAt)}</p>
            )}
          </div>
        </div>

        {/* Status Tracker */}
        <div className="mt-4">
          <div className="flex items-center gap-3">
            {statusIcons[task.status]}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${statusColors[task.status]}`}
                style={{
                  width:
                    task.status === 'pending'
                      ? '33%'
                      : task.status === 'in-progress'
                      ? '66%'
                      : '100%',
                }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-1 capitalize">{task.status.replace('-', ' ')}</p>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-slate-800 mb-4">Edit Task</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 outline-blue-400"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 outline-blue-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 outline-blue-400"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
