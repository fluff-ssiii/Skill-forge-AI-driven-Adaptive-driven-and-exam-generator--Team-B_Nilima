import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { progressService } from '../services/progressService';
import { topicService } from '../services/topicService';
import ProgressCard from '../components/ProgressCard';
import TopicDetailModal from '../components/TopicDetailModal';

function StudentDashboard() {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const [dashboardData, setDashboardData] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [showTopicModal, setShowTopicModal] = useState(false);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = authService.getCurrentUser()?.user || authService.getCurrentUser();
    const studentId = user?.userId || user?.id || user?.userId;

    useEffect(() => {
        if (activeMenu === 'Dashboard') {
            fetchDashboardData();
        }
    }, [activeMenu]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await progressService.getDashboardData();
            setDashboardData(data);
        } catch (err) {
            console.error('Error fetching dashboard:', err);
            setError('Failed to load dashboard data. Using demo data.');
            // Set demo data for testing
            setDashboardData({
                currentDifficulty: 'EASY',
                lastQuizScore: 0,
                completionStatus: 'Not yet completed',
                progressCards: [],
                nextSuggestion: null
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = async (topicId) => {
        try {
            const topic = await topicService.getTopicById(topicId);
            setSelectedTopic(topic);
            setShowTopicModal(true);
        } catch (err) {
            console.error('Error fetching topic:', err);
            alert('Failed to load topic details');
        }
    };

    

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const menuItems = [
        {
            name: 'Dashboard',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
        },
        {
            name: 'My Courses',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
        },
        {
            name: 'Quizzes',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>
        },
        
        {
            name: 'Profile',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        },
        {
            name: 'Performance',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><polyline points="3 13 9 7 13 11 21 3" /></svg>
        },
    ];

    

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-brand">SkillForge</div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <div
                            key={item.name}
                            className={`sidebar-item ${activeMenu === item.name ? 'active' : ''}`}
                            onClick={() => {
                                setActiveMenu(item.name);
                                if (item.name === 'Profile') {
                                    navigate('/student-dashboard/profile');
                                } else if (item.name === 'My Courses') {
                                    navigate('/student-dashboard/my-courses');
                                } else if (item.name === 'Quizzes') {
                                    navigate('/student-dashboard/quizzes');
                                } else if (item.name === 'AI Quiz') {
                                    navigate('/student-dashboard/ai-quiz');
                                } else if (item.name === 'Performance') {
                                    navigate('/student-dashboard/performance');
                                }
                            }}
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

            {/* Main Content */}
            <div className="main-content">
                <div className="content-header">
                    <h1>Student Dashboard</h1>
                    <p>Hello, {user?.fullName || 'Student'}</p>
                </div>

                <div className="content-body">
                    {loading ? (
                        <div className="loading-message">Loading...</div>
                    ) : activeMenu === 'Dashboard' && dashboardData ? (
                        <>
                            {/* Dashboard Header Info */}
                            <div className="dashboard-info">
                                <div className="info-card">
                                    <strong>Difficulty:</strong> {dashboardData.currentDifficulty}
                                </div>
                                <div className="info-card">
                                    <strong>Last Quiz Score:</strong> {dashboardData.lastQuizScore}
                                </div>
                                <div className="info-card status">
                                    {dashboardData.completionStatus === 'Not yet completed' && '❌ '}
                                    {dashboardData.completionStatus}
                                </div>
                            </div>

                            {/* Your Progress Section */}
                            <div className="progress-section">
                                <h2>Your Progress</h2>
                                {dashboardData.progressCards && dashboardData.progressCards.length > 0 ? (
                                    <div className="progress-cards-grid">
                                        {dashboardData.progressCards.map((progress) => (
                                            <ProgressCard
                                                key={progress.id}
                                                progress={progress}
                                                onClick={handleCardClick}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-data">No progress data yet. Start taking quizzes to see your progress!</p>
                                )}
                            </div>

                            {/* Next Suggestion Section */}
                            {dashboardData.nextSuggestion && (
                                <div className="suggestion-section">
                                    <h2>Next Suggested Lesson</h2>
                                    <div className="suggestion-card">
                                        <h3>{dashboardData.nextSuggestion.title}</h3>
                                        <p><strong>Suggested Difficulty:</strong> {dashboardData.nextSuggestion.difficulty}</p>
                                        <div className="suggestion-links">
                                            {dashboardData.nextSuggestion.videoUrl && (
                                                <a href={dashboardData.nextSuggestion.videoUrl} target="_blank" rel="noopener noreferrer" className="suggestion-link">
                                                    📹 Watch Video
                                                </a>
                                            )}
                                            {dashboardData.nextSuggestion.pdfUrl && (
                                                <a href={dashboardData.nextSuggestion.pdfUrl} target="_blank" rel="noopener noreferrer" className="suggestion-link">
                                                    📄 Download PDF
                                                </a>
                                            )}
                                            {dashboardData.nextSuggestion.externalLink && (
                                                <a href={dashboardData.nextSuggestion.externalLink} target="_blank" rel="noopener noreferrer" className="suggestion-link">
                                                    🔗 Open External Link
                                                </a>
                                            )}
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => navigate('/student-dashboard/quizzes')}
                                        >
                                            Start Quiz
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="dashboard-cards">
                            <div className="dashboard-card">
                                <h3>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }}>
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                    </svg>
                                    Continue Learning
                                </h3>
                                <p>Explore your enrolled courses and continue your journey.</p>
                                <button className="btn btn-primary">View Courses</button>
                            </div>

                            

                            <div className="dashboard-card">
                                <h3>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }}>
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                    </svg>
                                    Your Performance
                                </h3>
                                <p>Check your learning growth and analytics.</p>
                                <button className="btn btn-primary">View Stats</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Topic Detail Modal */}
            {showTopicModal && selectedTopic && (
                <TopicDetailModal
                    topic={selectedTopic}
                    onClose={() => setShowTopicModal(false)}
                />
            )}
        </div>
    );
}

export default StudentDashboard;
