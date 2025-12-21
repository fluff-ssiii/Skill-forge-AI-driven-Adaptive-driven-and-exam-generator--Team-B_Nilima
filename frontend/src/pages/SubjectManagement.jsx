import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

function SubjectManagement() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        courseId: courseId
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCourse();
        fetchSubjects();
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/courses/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCourse(data);
            }
        } catch (err) {
            setError('Failed to fetch course');
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/subjects/course/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setSubjects(data);
            }
        } catch (err) {
            setError('Failed to fetch subjects');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = editingId
                ? `http://localhost:8080/api/subjects/${editingId}`
                : 'http://localhost:8080/api/subjects';

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`
                },
                body: JSON.stringify({ ...formData, courseId })
            });

            if (response.ok) {
                setFormData({ name: '', description: '', courseId });
                setEditingId(null);
                fetchSubjects();
            } else {
                setError('Failed to save subject');
            }
        } catch (err) {
            setError('Failed to save subject');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (subject) => {
        setFormData({
            name: subject.name,
            description: subject.description,
            courseId: courseId
        });
        setEditingId(subject.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subject?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/subjects/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`
                }
            });

            if (response.ok) {
                fetchSubjects();
            } else {
                setError('Failed to delete subject');
            }
        } catch (err) {
            setError('Failed to delete subject');
        }
    };

    const handleManageTopics = (subjectId) => {
        navigate(`/courses/${courseId}/subjects/${subjectId}/topics`);
    };

    return (
        <div className="content-body">
            <div className="breadcrumb">
                <Link to="/courses">Courses</Link>
                <span className="breadcrumb-separator">›</span>
                <span>{course?.title || 'Loading...'}</span>
                <span className="breadcrumb-separator">›</span>
                <span>Subjects</span>
            </div>

            <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Subject Management</h2>

            {error && (
                <div className="alert alert-error">{error}</div>
            )}

            <div className="form-section">
                <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>
                    {editingId ? 'Edit Subject' : 'Create Subject'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Subject Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                placeholder="Enter subject name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="description">Description:</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                className="form-input"
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : editingId ? 'Update Subject' : 'Save Subject'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData({ name: '', description: '', courseId });
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="table-container">
                <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Subjects for {course?.title}</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                    No subjects found
                                </td>
                            </tr>
                        ) : (
                            subjects.map(subject => (
                                <tr key={subject.id}>
                                    <td>{subject.name}</td>
                                    <td>{subject.description}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                className="btn btn-small btn-primary"
                                                onClick={() => handleEdit(subject)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-small btn-danger"
                                                onClick={() => handleDelete(subject.id)}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="btn btn-small btn-success"
                                                onClick={() => handleManageTopics(subject.id)}
                                            >
                                                Manage Topics
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SubjectManagement;
