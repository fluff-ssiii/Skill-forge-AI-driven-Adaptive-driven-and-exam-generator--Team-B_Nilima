import { useState, useEffect } from 'react';
import CourseForm from '../components/CourseForm';
import CourseList from '../components/CourseList';
import { courseService } from '../services/courseService';

function CourseManagementPage() {
    const [courses, setCourses] = useState([]);
    const [editingCourse, setEditingCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await courseService.getAllCourses();
            setCourses(data);
        } catch (err) {
            setError('Failed to load courses. Make sure you are logged in.');
            console.error('Error loading courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setLoading(true);
            setError('');

            if (editingCourse) {
                await courseService.updateCourse(editingCourse.id, formData);
                alert('Course updated successfully!');
            } else {
                await courseService.createCourse(formData);
                alert('Course created successfully!');
            }

            setEditingCourse(null);
            await loadCourses();
        } catch (err) {
            setError('Failed to save course. Please try again.');
            console.error('Error saving course:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (courseId) => {
        try {
            setLoading(true);
            setError('');
            await courseService.deleteCourse(courseId);
            alert('Course deleted successfully!');
            await loadCourses();
        } catch (err) {
            setError('Failed to delete course. Please try again.');
            console.error('Error deleting course:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditingCourse(null);
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            padding: '40px 20px'
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '10px',
                    textAlign: 'center'
                }}>
                    Course Management
                </h1>
                <p style={{
                    color: '#666',
                    fontSize: '16px',
                    marginBottom: '40px',
                    textAlign: 'center'
                }}>
                    Create and manage courses with difficulty levels
                </p>

                {error && (
                    <div style={{
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '12px 20px',
                        borderRadius: '4px',
                        marginBottom: '20px',
                        border: '1px solid #f5c6cb'
                    }}>
                        {error}
                    </div>
                )}

                {loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: '#666'
                    }}>
                        Loading...
                    </div>
                )}

                <div style={{ marginBottom: '40px' }}>
                    <CourseForm
                        onSubmit={handleSubmit}
                        editingCourse={editingCourse}
                        onCancel={handleCancel}
                    />
                </div>

                <CourseList
                    courses={courses}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}

export default CourseManagementPage;
