import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './AdminDashboard.css';

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
        <div className="admin-dashboard">
            {/* Header */}
            <div className="admin-header">
                <div className="admin-header-content">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p>System Administration & Management</p>
                    </div>
                    <button onClick={handleLogout} className="btn-logout">
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-container">
                {/* Admin Profile Card */}
                <div className="admin-profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">👑</div>
                        <div className="profile-info">
                            <h3>Administrator</h3>
                            <p className="profile-name">{user.fullName}</p>
                            <p className="profile-email">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                            <p className="stat-label">Total Users</p>
                            <p className="stat-value">1,247</p>
                            <p className="stat-subtitle">↑ 28 this week</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📚</div>
                        <div className="stat-content">
                            <p className="stat-label">Total Courses</p>
                            <p className="stat-value">156</p>
                            <p className="stat-subtitle">Active courses</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">⚡</div>
                        <div className="stat-content">
                            <p className="stat-label">System Status</p>
                            <p className="stat-value online">● Online</p>
                            <p className="stat-subtitle">All operational</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-content">
                            <p className="stat-label">Response Time</p>
                            <p className="stat-value">145ms</p>
                            <p className="stat-subtitle">Average</p>
                        </div>
                    </div>
                </div>

                {/* User Statistics */}
                <div className="section">
                    <h2 className="section-title">📊 User Statistics</h2>
                    <div className="user-stats">
                        <div className="user-stat-card">
                            <p className="user-stat-label">Students</p>
                            <p className="user-stat-count" style={{ color: '#4CAF50' }}>1,050</p>
                            <p className="user-stat-percent">84.2% of total</p>
                        </div>
                        <div className="user-stat-card">
                            <p className="user-stat-label">Instructors</p>
                            <p className="user-stat-count" style={{ color: '#2196F3' }}>180</p>
                            <p className="user-stat-percent">14.4% of total</p>
                        </div>
                        <div className="user-stat-card">
                            <p className="user-stat-label">Admins</p>
                            <p className="user-stat-count" style={{ color: '#FF9800' }}>17</p>
                            <p className="user-stat-percent">1.4% of total</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="section">
                    <h2 className="section-title">🔔 Recent Activity</h2>
                    <div className="activity-card">
                        <div className="activity-item">
                            <div className="activity-icon">✓</div>
                            <div className="activity-content">
                                <p className="activity-title">New user registered: john.doe@example.com</p>
                                <p className="activity-time">5 minutes ago • Role: Student</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">✓</div>
                            <div className="activity-content">
                                <p className="activity-title">Course created: Advanced Mathematics</p>
                                <p className="activity-time">1 hour ago • By: Prof. Smith</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">✓</div>
                            <div className="activity-content">
                                <p className="activity-title">User role updated: jane.smith@example.com</p>
                                <p className="activity-time">3 hours ago • Student → Instructor</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">✓</div>
                            <div className="activity-content">
                                <p className="activity-title">System backup completed successfully</p>
                                <p className="activity-time">6 hours ago • Size: 2.4 GB</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Management */}
                <div className="section">
                    <h2 className="section-title">⚙️ System Management</h2>
                    <div className="management-grid">
                        <button className="management-btn">👥 Manage Users</button>
                        <button className="management-btn">📚 Manage Courses</button>
                        <button className="management-btn">📊 View Analytics</button>
                        <button className="management-btn">🔒 Security Settings</button>
                        <button className="management-btn">📧 Email Templates</button>
                        <button className="management-btn">💾 Backup & Restore</button>
                        <button className="management-btn">📝 Activity Logs</button>
                        <button className="management-btn">⚡ System Settings</button>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="section">
                    <h2 className="section-title">📈 Performance Metrics</h2>
                    <div className="metrics-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Metric</th>
                                    <th>Today</th>
                                    <th>This Week</th>
                                    <th>This Month</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Active Users</td>
                                    <td><strong>342</strong></td>
                                    <td>1,156</td>
                                    <td>1,247</td>
                                </tr>
                                <tr>
                                    <td>New Registrations</td>
                                    <td><strong>5</strong></td>
                                    <td>28</td>
                                    <td>156</td>
                                </tr>
                                <tr>
                                    <td>Login Success Rate</td>
                                    <td><strong style={{ color: '#4CAF50' }}>99.2%</strong></td>
                                    <td>98.7%</td>
                                    <td>98.5%</td>
                                </tr>
                                <tr>
                                    <td>Avg Response Time</td>
                                    <td><strong style={{ color: '#4CAF50' }}>145ms</strong></td>
                                    <td>152ms</td>
                                    <td>148ms</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
