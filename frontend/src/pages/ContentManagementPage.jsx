import { useState, useEffect } from 'react';
import SubjectForm from '../components/SubjectForm';
import SubjectList from '../components/SubjectList';
import TopicForm from '../components/TopicForm';
import TopicList from '../components/TopicList';
import { subjectService } from '../services/subjectService';
import { topicService } from '../services/topicService';

function ContentManagementPage() {
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [editingSubject, setEditingSubject] = useState(null);
    const [editingTopic, setEditingTopic] = useState(null);
    const [activeTab, setActiveTab] = useState('subjects'); // 'subjects' or 'topics'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSubjects();
        loadTopics();
    }, []);

    const loadSubjects = async () => {
        try {
            setLoading(true);
            const data = await subjectService.getAllSubjects();
            setSubjects(data);
        } catch (err) {
            console.error('Error loading subjects:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadTopics = async () => {
        try {
            setLoading(true);
            const data = await topicService.getAllTopics();
            setTopics(data);
        } catch (err) {
            console.error('Error loading topics:', err);
        } finally {
            setLoading(false);
        }
    };

    // Subject handlers
    const handleSubjectSubmit = async (formData) => {
        try {
            setLoading(true);
            setError('');

            if (editingSubject) {
                await subjectService.updateSubject(editingSubject.id, formData);
                alert('Subject updated successfully!');
            } else {
                await subjectService.createSubject(formData);
                alert('Subject created successfully!');
            }

            setEditingSubject(null);
            await loadSubjects();
        } catch (err) {
            setError('Failed to save subject. Please try again.');
            console.error('Error saving subject:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubjectEdit = (subject) => {
        setEditingSubject(subject);
        setActiveTab('subjects');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubjectDelete = async (subjectId) => {
        try {
            setLoading(true);
            await subjectService.deleteSubject(subjectId);
            alert('Subject deleted successfully!');
            await loadSubjects();
        } catch (err) {
            setError('Failed to delete subject. Please try again.');
            console.error('Error deleting subject:', err);
        } finally {
            setLoading(false);
        }
    };

    // Topic handlers
    const handleTopicSubmit = async (formData) => {
        try {
            setLoading(true);
            setError('');

            if (editingTopic) {
                await topicService.updateTopic(editingTopic.id, formData);
                alert('Topic updated successfully!');
            } else {
                await topicService.createTopic(formData);
                alert('Topic created successfully!');
            }

            setEditingTopic(null);
            await loadTopics();
        } catch (err) {
            setError('Failed to save topic. Please try again.');
            console.error('Error saving topic:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTopicEdit = (topic) => {
        setEditingTopic(topic);
        setActiveTab('topics');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleTopicDelete = async (topicId) => {
        try {
            setLoading(true);
            await topicService.deleteTopic(topicId);
            alert('Topic deleted successfully!');
            await loadTopics();
        } catch (err) {
            setError('Failed to delete topic. Please try again.');
            console.error('Error deleting topic:', err);
        } finally {
            setLoading(false);
        }
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
                    Content Management
                </h1>
                <p style={{
                    color: '#666',
                    fontSize: '16px',
                    marginBottom: '40px',
                    textAlign: 'center'
                }}>
                    Manage subjects and topics with file uploads
                </p>

                {/* Tab Navigation */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '30px',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={() => setActiveTab('subjects')}
                        className="btn"
                        style={{
                            backgroundColor: activeTab === 'subjects' ? '#0066cc' : '#fff',
                            color: activeTab === 'subjects' ? '#fff' : '#333',
                            padding: '12px 24px',
                            border: '1px solid #ccc'
                        }}
                    >
                        📚 Subjects
                    </button>
                    <button
                        onClick={() => setActiveTab('topics')}
                        className="btn"
                        style={{
                            backgroundColor: activeTab === 'topics' ? '#0066cc' : '#fff',
                            color: activeTab === 'topics' ? '#fff' : '#333',
                            padding: '12px 24px',
                            border: '1px solid #ccc'
                        }}
                    >
                        📝 Topics
                    </button>
                </div>

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

                {/* Subjects Tab */}
                {activeTab === 'subjects' && (
                    <>
                        <div style={{ marginBottom: '40px' }}>
                            <SubjectForm
                                onSubmit={handleSubjectSubmit}
                                editingSubject={editingSubject}
                                onCancel={() => setEditingSubject(null)}
                            />
                        </div>
                        <SubjectList
                            subjects={subjects}
                            onEdit={handleSubjectEdit}
                            onDelete={handleSubjectDelete}
                        />
                    </>
                )}

                {/* Topics Tab */}
                {activeTab === 'topics' && (
                    <>
                        <div style={{ marginBottom: '40px' }}>
                            <TopicForm
                                onSubmit={handleTopicSubmit}
                                editingTopic={editingTopic}
                                onCancel={() => setEditingTopic(null)}
                                subjects={subjects}
                            />
                        </div>
                        <TopicList
                            topics={topics}
                            subjects={subjects}
                            onEdit={handleTopicEdit}
                            onDelete={handleTopicDelete}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default ContentManagementPage;
