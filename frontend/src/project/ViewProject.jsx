import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import TaskCard from '../task/TaskCard';
import Layout from '../components/Layout';
import AddTask from '../task/AddTask';  // 👈 import CreateTask popup
import { PROJECT_API_END_POINT } from '../utils/utils';

const ViewProject = () => {
  const { id } = useParams(); // projectId
  const [tasks, setTasks] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false); // 👈 for task popup

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${PROJECT_API_END_POINT}/get-projects`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const currentProject = res.data.find((proj) => proj._id === id);
      if (currentProject) {
        setProjectName(currentProject?.name);
        setTasks(currentProject.tasks || []);
      } else {
        setError('Project not found');
      }
    } catch (err) {
      setError('Failed to fetch project data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [id]);

  if (loading) {
    return (
      <Layout username="John Doe" buttonLabel="Add New Task" onButtonClick={() => setShowModal(true)}>
        <div className="flex justify-center items-center py-24">
          <Spinner size = 'md' />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout username="John Doe" buttonLabel="Add New Task" onButtonClick={() => setShowModal(true)}>
        <p className="text-red-500 text-center mt-10">{error}</p>
      </Layout>
    );
  }

  return (
    <Layout username="John Doe" buttonLabel="Add New Task" onButtonClick={() => setShowModal(true)}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Project: {projectName}</h2>
        <p className="text-slate-500 mt-1">{tasks.length} task(s)</p>
      </div>

      {tasks.length === 0 ? (
        <p className="text-slate-600">No tasks found for this project.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} refreshTasks={fetchTasks} />
          ))}
        </div>
      )}

      {/* CreateTask Popup */}
      {showModal && (
        <AddTask 
          projectId={id} 
          onClose={() => setShowModal(false)} 
          onTaskCreated={() => {
            setShowModal(false);
            fetchTasks();
          }}
        />
      )}
    </Layout>
  );
};

export default ViewProject;
