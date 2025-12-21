import { useState, useEffect } from 'react';
import StudentForm from './StudentForm.jsx';
import StudentList from './StudentList.jsx';
import { studentService } from './services/studentService';

function StudentManagementPage() {
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load students on component mount
    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await studentService.getAllStudents();
            setStudents(data);
        } catch (err) {
            setError('Failed to load students. Make sure you are logged in and the backend is running.');
            console.error('Error loading students:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setLoading(true);
            setError('');

            if (editingStudent) {
                // Update existing student
                await studentService.updateStudent(editingStudent.id, formData);
                alert('Student updated successfully!');
            } else {
                // Create new student
                await studentService.createStudent(formData);
                alert('Student added successfully!');
            }

            setEditingStudent(null);
            await loadStudents();
        } catch (err) {
            setError('Failed to save student. Please try again.');
            console.error('Error saving student:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (studentId) => {
        try {
            setLoading(true);
            setError('');
            await studentService.deleteStudent(studentId);
            alert('Student deleted successfully!');
            await loadStudents();
        } catch (err) {
            setError('Failed to delete student. Please try again.');
            console.error('Error deleting student:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditingStudent(null);
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
                    Student Management System
                </h1>
                <p style={{
                    color: '#666',
                    fontSize: '16px',
                    marginBottom: '40px',
                    textAlign: 'center'
                }}>
                    Add, edit, and manage student records
                </p>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: '20px' }}>
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

                {/* Student Form */}
                <div style={{ marginBottom: '40px' }}>
                    <StudentForm
                        onSubmit={handleSubmit}
                        editingStudent={editingStudent}
                        onCancel={handleCancel}
                    />
                </div>

                {/* Student List */}
                <StudentList
                    students={students}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}

export default StudentManagementPage;
