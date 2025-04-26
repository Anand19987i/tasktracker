import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PROJECT_API_END_POINT } from '../utils/utils';
import { useSelector } from 'react-redux';
import ProjectCard from '../project/ProjectCard';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout'; // Import the Layout component
import Spinner from '../components/Spinner';

const FavouriteProject = () => {
    const [favoriteProjects, setFavoriteProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((store) => store.auth);
    const userId = user.id;
    const fetchFavoriteProjects = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${PROJECT_API_END_POINT}/favourite/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            if (response.data.success) {
                setLoading(false);
                setFavoriteProjects(response.data.projects);
            }
        } catch (err) {
            setLoading(false);
            console.error('Failed to fetch favorite projects:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchFavoriteProjects();
        }
    }, [user]);

    const handleProjectEdit = (updatedProject) => {
        setFavoriteProjects((prev) =>
            prev.map((project) =>
                project._id === updatedProject._id ? updatedProject : project
            )
        );
    };

    const handleProjectDelete = (projectId) => {
        setFavoriteProjects((prev) => prev.filter((project) => project?._id !== projectId));
    };

    return (
        <Layout
            username={user?.username} // Pass username from the user state
            onButtonClick={() => console.log('Button clicked')} // Replace with actual action

        >
            <div className="p-2">
                <h2 className="text-2xl text-gray-800 font-medium mb-6">Your Favorite Projects</h2>
                {
                    favoriteProjects?.length === 0 && (
                        <p className='text-gray-600'>No Favourite Projects.</p>
                    )
                }
                {
                    loading ? (
                        <div className="flex justify-center items-center h-full py-20">
                            <Spinner size = 'md' />
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 py-5">
                            {favoriteProjects.map((project) => (
                                <ProjectCard
                                    key={project._id}
                                    project={project}
                                    onEdit={handleProjectEdit}
                                    onDelete={handleProjectDelete}
                                />
                            ))}
                        </div>
                    )
                }

            </div>
        </Layout>
    );
};

export default FavouriteProject;
