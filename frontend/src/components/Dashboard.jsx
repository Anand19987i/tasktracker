import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CreateProject from '../components/CreateProject';
import Projects from '../project/Projects';

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleProjectCreated = () => {
    setShowModal(false);
    setRefresh((prev) => !prev);
  };

  return (
    <Layout 
      username={user?.username || 'Guest'} 
      onButtonClick={() => setShowModal(true)}
      buttonLabel="Add New Project"
    >
      <div className="text-slate-800">
        <h1 className="text-2xl font-semibold mb-6">Your Projects</h1>
        <Projects refresh={refresh} />
      </div>

      {showModal && (
        <CreateProject
          onClose={() => setShowModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </Layout>
  );
};

export default Dashboard;
