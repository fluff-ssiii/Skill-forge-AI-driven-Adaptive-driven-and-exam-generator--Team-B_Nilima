import { useState, useEffect } from 'react';

function StudentForm({ onSubmit, editingStudent, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingStudent) {
            setFormData({
                name: editingStudent.name || '',
                email: editingStudent.email || ''
            });
        } else {
            setFormData({
                name: '',
                email: ''
            });
        }
    }, [editingStudent]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
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
        // Clear error for this field when user starts typing
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
            // Reset form after successful submission
            if (!editingStudent) {
                setFormData({
                    name: '',
                    email: ''
                });
            }
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card-header">
                <h2 className="card-title">
                    {editingStudent ? 'Edit Student' : 'Add Student'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="name" className="form-label">
                        Student Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Student Name"
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        Student Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Student Email"
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                </div>



                <button type="submit" className="btn btn-primary">
                    Save Student
                </button>
            </form>
        </div>
    );
}

export default StudentForm;
