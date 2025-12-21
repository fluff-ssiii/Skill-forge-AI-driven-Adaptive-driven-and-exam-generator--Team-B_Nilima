import { useState, useEffect } from 'react';

function CourseForm({ onSubmit, editingCourse, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        difficultyLevel: 'MEDIUM',
        instructorId: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingCourse) {
            setFormData({
                title: editingCourse.title || '',
                difficultyLevel: editingCourse.difficultyLevel || 'MEDIUM',
                instructorId: editingCourse.instructorId || ''
            });
        } else {
            // Get instructor ID from logged-in user
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setFormData({
                title: '',
                difficultyLevel: 'MEDIUM',
                instructorId: user.id || ''
            });
        }
    }, [editingCourse]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Course title is required';
        }

        if (!formData.instructorId) {
            newErrors.instructorId = 'Instructor ID is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
            if (!editingCourse) {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                setFormData({
                    title: '',
                    difficultyLevel: 'MEDIUM',
                    instructorId: user.id || ''
                });
            }
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card-header">
                <h2 className="card-title">
                    {editingCourse ? 'Edit Course' : 'Create Course'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="title" className="form-label">
                        Course Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter course title"
                    />
                    {errors.title && <span className="form-error">{errors.title}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="difficultyLevel" className="form-label">
                        Difficulty Level
                    </label>
                    <select
                        id="difficultyLevel"
                        name="difficultyLevel"
                        value={formData.difficultyLevel}
                        onChange={handleChange}
                        className="form-input"
                    >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">
                    {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
            </form>
        </div>
    );
}

export default CourseForm;
