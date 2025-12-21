import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser);
        }
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (!user) {
        return null;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>
                <button onClick={handleLogout} className="btn btn-primary">
                    Logout
                </button>
            </div>

            <div className="dashboard-content">
                <div className="info-card">
                    <div className="info-card-title">Welcome</div>
                    <div className="info-card-value">
                        {user.fullName || user.email}
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-card-title">Email</div>
                    <div className="info-card-value" style={{ fontSize: '18px' }}>
                        {user.email}
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-card-title">Role</div>
                    <div className="info-card-value">
                        <span className="badge">{user.role || 'USER'}</span>
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-card-title">Status</div>
                    <div className="info-card-value">
                        <span className="badge" style={{ backgroundColor: '#00cc00' }}>
                            Logged In
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
