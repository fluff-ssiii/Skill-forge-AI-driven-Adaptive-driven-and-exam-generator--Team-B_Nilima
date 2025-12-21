import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser.user || currentUser);
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
                <div>
                    <h1 className="dashboard-title">Admin Dashboard</h1>
                    <p className="text-secondary">System Administration Panel</p>
                </div>
                <button onClick={handleLogout} className="btn btn-primary">
                    Logout
                </button>
            </div>

            <div className="dashboard-content">
                {/* Admin Info Card */}
                <div className="info-card">
                    <div className="info-card-title">👑 Administrator</div>
                    <div className="info-card-value" style={{ fontSize: '18px' }}>
                        <strong>{user.fullName}</strong>
                        <br />
                        <span style={{ fontSize: '14px', color: '#666' }}>{user.email}</span>
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-card-title">👥 Total Users</div>
                    <div className="info-card-value">
                        <span style={{ fontSize: '32px', fontWeight: 'bold' }}>1,247</span>
                        <br />
                        <span style={{ fontSize: '14px', color: '#00cc00' }}>↑ 28 this week</span>
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-card-title">📚 Total Courses</div>
                    <div className="info-card-value">
                        <span style={{ fontSize: '32px', fontWeight: 'bold' }}>156</span>
                        <br />
                        <span style={{ fontSize: '14px', color: '#666' }}>Active</span>
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-card-title">⚡ System Status</div>
                    <div className="info-card-value">
                        <span className="badge" style={{ backgroundColor: '#00cc00', fontSize: '16px' }}>
                            ● Online
                        </span>
                        <br />
                        <span style={{ fontSize: '14px', color: '#666' }}>All systems operational</span>
                    </div>
                </div>
            </div>

            {/* User Statistics */}
            <div style={{ marginTop: '30px' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>📊 User Statistics</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Students</div>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4CAF50' }}>1,050</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>84.2% of total</div>
                    </div>
                    <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Instructors</div>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2196F3' }}>180</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>14.4% of total</div>
                    </div>
                    <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Admins</div>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FF9800' }}>17</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>1.4% of total</div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div style={{ marginTop: '30px' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>🔔 Recent Activity</h2>
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>New user registered: john.doe@example.com</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>5 minutes ago • Role: Student</div>
                    </div>
                    <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Course created: Advanced Mathematics</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>1 hour ago • By: Prof. Smith</div>
                    </div>
                    <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>User role updated: jane.smith@example.com</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>3 hours ago • Student → Instructor</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>System backup completed successfully</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>6 hours ago • Size: 2.4 GB</div>
                    </div>
                </div>
            </div>

            {/* System Management */}
            <div style={{ marginTop: '30px' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>⚙️ System Management</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <button className="btn btn-primary" style={{ padding: '15px' }}>
                        👥 Manage Users
                    </button>
                    <button className="btn btn-primary" style={{ padding: '15px' }}>
                        📚 Manage Courses
                    </button>
                    <button className="btn btn-primary" style={{ padding: '15px' }}>
                        📊 View Analytics
                    </button>
                    <button className="btn btn-primary" style={{ padding: '15px' }}>
                        🔒 Security Settings
                    </button>
                    <button className="btn btn-primary" style={{ padding: '15px' }}>
                        📧 Email Templates
                    </button>
                    <button className="btn btn-primary" style={{ padding: '15px' }}>
                        💾 Backup & Restore
                    </button>
                    <button className="btn btn-primary" style={{ padding: '15px' }}>
                        📝 Activity Logs
                    </button>
                    <button className="btn btn-primary" style={{ padding: '15px' }}>
                        ⚡ System Settings
                    </button>
                </div>
            </div>

            {/* Quick Stats Table */}
            <div style={{ marginTop: '30px' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>📈 Performance Metrics</h2>
                <div className="card" style={{ padding: '20px', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Metric</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Today</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>This Week</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>This Month</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>Active Users</td>
                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>342</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>1,156</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>1,247</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>New Registrations</td>
                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>5</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>28</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>156</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>Login Success Rate</td>
                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#00cc00' }}>99.2%</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>98.7%</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>98.5%</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '12px' }}>Avg Response Time</td>
                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#00cc00' }}>145ms</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>152ms</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>148ms</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
