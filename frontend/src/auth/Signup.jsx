import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { USER_API_END_POINT } from '../utils/utils';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Spinner from '../components/Spinner';

const Signup = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', country: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const togglePassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            const response = await axios.post(`${USER_API_END_POINT}/signup`, form, {
                withCredentials: true,
            });
            if (response.data.success) {
                setLoading(false);
                localStorage.setItem('token', response.data.token);
                navigate('/login');
            }
            setError(response.data.message);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form onSubmit={handleSubmit} className="bg-white shadow-xl p-8 rounded-2xl w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">Sign up for Task Tracker</h2>
                {error && <p className="text-red-500 mb-3 text-sm text-center">{error}</p>}

                <InputField label="Name" name="name" value={form.name} onChange={handleChange} required />
                <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />

                {/* Password with toggle icon */}
                <div className="mb-4 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <span
                        className="absolute right-4 top-[38px] cursor-pointer text-gray-500"
                        onClick={togglePassword}
                    >
                        {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </span>
                </div>

                <InputField label="Country" name="country" value={form.country} onChange={handleChange} required />

                <button type='submit' className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">{loading ? <Spinner className='text-white'/> : 'SignUp'}</button>
                <p className="mt-4 text-sm text-center">
                    Already have an account? <Link to="/login" className="text-blue-600 underline">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
