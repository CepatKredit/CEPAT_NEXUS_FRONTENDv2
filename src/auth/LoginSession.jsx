import React from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

export function LoginSession() {
    const token = localStorage.getItem('UTK');
    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (token && (location.pathname === '/' || location.pathname === '/loan-application')) {
            navigate('/ckfi/dashboard', { replace: true });
        }
    }, [token, location.pathname, navigate]);

    React.useEffect(() => {
        const handlePopState = () => {
            if (token && (location.pathname === '/' || location.pathname === '/loan-application')) {
                navigate('/ckfi/dashboard', { replace: true });
                window.location.reload();
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [token, location.pathname, navigate]);

    if (token && (location.pathname === '/' || location.pathname === '/loan-application')) {
        return <Navigate to="/ckfi/dashboard" replace />;
    }

    return <Outlet />;
}