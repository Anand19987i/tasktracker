import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { PROJECT_API_END_POINT } from '../utils/utils';
import ProjectCard from './ProjectCard';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Projects = ({ refresh }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useSelector(store => store.auth);
    // Function to fetch projects
    const fetchProjects = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${PROJECT_API_END_POINT}/get-projects`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            if (response.data) {
                setLoading(false);
                setProjects(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load projects');
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProjects();
    }, [refresh, user]);
    const handleDelete = (projectId) => {
        setProjects((prevProjects) => prevProjects.filter((project) => project?._id !== projectId));
    };

   
    const handleEdit = (updatedProject) => {
        setProjects((prevProjects) =>
            prevProjects.map((project) =>
                project?._id === updatedProject?._id ? updatedProject : project
            )
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full py-20">
                <Spinner size = 'md' />
            </div>
        );
    }

    return (
        <div className="p-6">
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {projects?.length === 0 ? (
                <p className="text-slate-500">No projects found. Click "Add New Project" to create your first one.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects?.map((project) => (
                        <ProjectCard
                            key={project?._id}
                            project={project}
                            onDelete={handleDelete} 
                            onEdit={handleEdit}    
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Projects;
