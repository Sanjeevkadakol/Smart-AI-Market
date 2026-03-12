import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ModernSignIn } from '../components/ui/ModernSignIn';
import { useAuth } from '../context/AuthContext';
const LoginPage = () => {
    const [mode, setMode] = useState('login');
    const navigate = useNavigate();

    const { login } = useAuth();

    const toggleMode = () => {
        setMode(prev => prev === 'login' ? 'signup' : 'login');
    };

    const handleAuth = async (data) => {
        try {
            const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
            const res = await axios.post(endpoint, data);

            if (res.data.success) {
                const userRole = res.data.user?.role || data.role;
                const userData = res.data.user || { role: userRole, name: data.name };

                // Use global auth context
                login(res.data.token, userData);

                // Redirect to Home Page
                navigate('/');
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Authentication failed');
        }
    };

    return (
        <div className="bg-white">
            <ModernSignIn mode={mode} onToggleMode={toggleMode} onSubmit={handleAuth} />
        </div>
    );
};

export default LoginPage;
