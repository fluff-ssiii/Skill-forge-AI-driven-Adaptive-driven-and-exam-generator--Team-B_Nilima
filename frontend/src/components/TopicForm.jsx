import { useState, useEffect } from 'react';

function TopicForm({ onSubmit, editingTopic, onCancel, subjects }) {
    const [formData, setFormData] = useState({
        subjectId: '',
        title: '',
        externalLink: '',
        video: null,
        pdf: null
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingTopic) {
            setFormData({
                subjectId: editingTopic.subjectId || '',
                title: editingTopic.title || '',
                externalLink: editingTopic.externalLink || '',
                video: null,
                pdf: null
            });
        } else {
            setFormData({
                subjectId: subjects.length > 0 ? subjects[0].id : '',
                title: '',
                externalLink: '',
                video: null,
                pdf: null
            });
        }
    }, [editingTopic, subjects]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.subjectId) {
            newErrors.subjectId = 'Subject is required';
        }

        if (!formData.title.trim()) {
            newErrors.title = 'Topic title is required';
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

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
            if (!editingTopic) {
                setFormData({
                    subjectId: subjects.length > 0 ? subjects[0].id : '',
                    title: '',
                    externalLink: '',
                    video: null,
                    pdf: null
                });
                // Reset file inputs
                const videoInput = document.getElementById('video');
                const pdfInput = document.getElementById('pdf');
                if (videoInput) videoInput.value = '';
                if (pdfInput) pdfInput.value = '';
            }
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card-header">
                <h2 className="card-title">
                    {editingTopic ? 'Edit Topic' : 'Create Topic'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="subjectId" className="form-label">
                        Subject
                    </label>
                    <select
                        id="subjectId"
                        name="subjectId"
                        value={formData.subjectId}
                        onChange={handleChange}
                        className="form-input"
                    >
                        <option value="">Select a subject</option>
                        {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                    {errors.subjectId && <span className="form-error">{errors.subjectId}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="title" className="form-label">
                        Topic Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter topic title"
                    />
                    {errors.title && <span className="form-error">{errors.title}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="externalLink" className="form-label">
                        External Link (Optional)
                    </label>
                    <input
                        type="url"
                        id="externalLink"
                        name="externalLink"
                        value={formData.externalLink}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="https://example.com"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="video" className="form-label">
                        Upload Video (Optional)
                    </label>
                    <input
                        type="file"
                        id="video"
                        name="video"
                        onChange={handleFileChange}
                        className="form-input"
                        accept="video/*"
                    />
                    <small style={{ color: '#666', fontSize: '12px' }}>
                        Max size: 50MB
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="pdf" className="form-label">
                        Upload PDF (Optional)
                    </label>
                    <input
                        type="file"
                        id="pdf"
                        name="pdf"
                        onChange={handleFileChange}
                        className="form-input"
                        accept=".pdf"
                    />
                    <small style={{ color: '#666', fontSize: '12px' }}>
                        Max size: 50MB
                    </small>
                </div>

                <button type="submit" className="btn btn-primary">
                    {editingTopic ? 'Update Topic' : 'Create Topic'}
                </button>
            </form>
        </div>
    );
}

export default TopicForm;
