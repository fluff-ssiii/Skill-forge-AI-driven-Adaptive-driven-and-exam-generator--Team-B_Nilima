import { useState } from 'react';
import StudentForm from './StudentForm';
import StudentList from './StudentList';

/**
 * Example component showing how to use StudentForm and StudentList together
 * This demonstrates a complete CRUD (Create, Read, Update, Delete) workflow
 * 
 * You can integrate this into your StudentDashboard or use it as a standalone page
 */
function StudentCRUDExample() {
    // Sample data - replace this with API calls to your Spring Boot backend
    const [students, setStudents] = useState([
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            course: 'Computer Science',
            enrollmentDate: '2024-01-15'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            course: 'Mathematics',
            enrollmentDate: '2024-02-20'
        }
    ]);

    const [editingStudent, setEditingStudent] = useState(null);
    const [showForm, setShowForm] = useState(true);

    // Handle adding a new student
    const handleAddStudent = (formData) => {
        const newStudent = {
            id: students.length + 1, // In real app, this would come from backend
            ...formData
        };
        setStudents([...students, newStudent]);
        alert('Student added successfully!');

        // Optional: Make API call to backend
        // fetch('http://localhost:8080/api/students', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
    };

    // Handle updating an existing student
    const handleUpdateStudent = (formData) => {
        const updatedStudents = students.map(student =>
            student.id === editingStudent.id
                ? { ...student, ...formData }
                : student
        );
        setStudents(updatedStudents);
        setEditingStudent(null);
        alert('Student updated successfully!');

        // Optional: Make API call to backend
        // fetch(`http://localhost:8080/api/students/${editingStudent.id}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
    };

    // Handle form submission (add or update)
    const handleFormSubmit = (formData) => {
        if (editingStudent) {
            handleUpdateStudent(formData);
        } else {
            handleAddStudent(formData);
        }
    };

    // Handle edit button click
    const handleEdit = (student) => {
        setEditingStudent(student);
        setShowForm(true);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle delete button click
    const handleDelete = (studentId) => {
        const updatedStudents = students.filter(student => student.id !== studentId);
        setStudents(updatedStudents);
        alert('Student deleted successfully!');

        // Optional: Make API call to backend
        // fetch(`http://localhost:8080/api/students/${studentId}`, {
        //     method: 'DELETE'
        // });
    };

    // Handle cancel editing
    const handleCancel = () => {
        setEditingStudent(null);
    };

    // Handle refresh (useful for fetching latest data from backend)
    const handleRefresh = () => {
        alert('Refreshing student list...');
        // In real app, fetch data from backend
        // fetch('http://localhost:8080/api/students')
        //     .then(res => res.json())
        //     .then(data => setStudents(data));
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            padding: '40px 20px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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

                {/* Toggle Form Button */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <button
                        onClick={() => {
                            setShowForm(!showForm);
                            if (!showForm) {
                                setEditingStudent(null);
                            }
                        }}
                        className="btn btn-primary"
                        style={{ padding: '12px 24px' }}
                    >
                        {showForm ? '📋 Hide Form' : '➕ Add New Student'}
                    </button>
                </div>

                {/* Student Form */}
                {showForm && (
                    <div style={{ marginBottom: '40px' }}>
                        <StudentForm
                            onSubmit={handleFormSubmit}
                            editingStudent={editingStudent}
                            onCancel={handleCancel}
                        />
                    </div>
                )}

                {/* Student List */}
                <StudentList
                    students={students}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRefresh={handleRefresh}
                />
            </div>
        </div>
    );
}

export default StudentCRUDExample;
