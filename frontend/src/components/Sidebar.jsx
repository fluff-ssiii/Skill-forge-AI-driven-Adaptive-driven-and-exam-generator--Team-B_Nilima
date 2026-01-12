import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getCurrentUser()?.user || authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const menuItems = [
        {
            name: 'Dashboard',
            path: '/student-dashboard',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
        },
        {
            name: 'My Courses',
            path: '/student-dashboard/my-courses',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
        },
        {
            name: 'Quizzes',
            path: '/student-dashboard/quizzes',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>
        },
        {
            name: 'Profile',
            path: '/student-dashboard/profile',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        },
        {
            name: 'Performance',
            path: '/student-dashboard/performance',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><polyline points="3 13 9 7 13 11 21 3" /></svg>
        },
    ];

    const isActive = (path) => {
        if (path === '/student-dashboard' && location.pathname === '/student-dashboard') return true;
        if (path !== '/student-dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-brand">SkillForge</div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <div
                        key={item.name}
                        className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                        {item.name}
                    </div>
                ))}
                <div className="sidebar-item" onClick={handleLogout}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </span>
                    Logout
                </div>
            </nav>
        </div>
    );
}

export default Sidebar;
