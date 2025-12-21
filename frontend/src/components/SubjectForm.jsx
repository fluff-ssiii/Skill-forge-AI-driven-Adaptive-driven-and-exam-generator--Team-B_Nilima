import { useState, useEffect } from 'react';

function SubjectForm({ onSubmit, editingSubject, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingSubject) {
            setFormData({
                name: editingSubject.name || '',
                description: editingSubject.description || ''
            });
        } else {
            setFormData({
                name: '',
                description: ''
            });
        }
    }, [editingSubject]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Subject name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
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
            if (!editingSubject) {
                setFormData({
                    name: '',
                    description: ''
                });
            }
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card-header">
                <h2 className="card-title">
                    {editingSubject ? 'Edit Subject' : 'Create Subject'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="name" className="form-label">
                        Subject Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g., Mathematics, Physics"
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter subject description"
                        rows="4"
                        style={{ resize: 'vertical' }}
                    />
                    {errors.description && <span className="form-error">{errors.description}</span>}
                </div>

                <button type="submit" className="btn btn-primary">
                    {editingSubject ? 'Update Subject' : 'Create Subject'}
                </button>
            </form>
        </div>
    );
}

export default SubjectForm;
