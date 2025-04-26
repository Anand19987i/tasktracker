import React, { useState } from 'react';
import Layout from '../components/Layout';
import CreateProject from '../components/CreateProject';
import Projects from '../project/Projects';

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Trigger re-fetch in Projects by toggling refresh state
  const handleProjectCreated = () => {
    setShowModal(false);
    setRefresh((prev) => !prev);
  };

  return (
    <Layout 
      username="John Doe" 
      onButtonClick={() => setShowModal(true)}   // 👈 fix here
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
