function TopicList({ topics, subjects, onEdit, onDelete }) {
    const getSubjectName = (subjectId) => {
        const subject = subjects.find(s => s.id === subjectId);
        return subject ? subject.name : 'Unknown';
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '20px auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
                All Topics
            </h2>

            {topics.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#666', fontSize: '16px' }}>
                        No topics available. Create your first topic!
                    </p>
                </div>
            ) : (
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    overflow: 'hidden'
                }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse'
                    }}>
                        <thead>
                            <tr style={{
                                backgroundColor: '#f5f5f5',
                                borderBottom: '2px solid #ccc'
                            }}>
                                <th style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    color: '#333'
                                }}>
                                    ID
                                </th>
                                <th style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    color: '#333'
                                }}>
                                    Title
                                </th>
                                <th style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    color: '#333'
                                }}>
                                    Subject
                                </th>
                                <th style={{
                                    padding: '15px',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    color: '#333'
                                }}>
                                    Resources
                                </th>
                                <th style={{
                                    padding: '15px',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    color: '#333'
                                }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {topics.map((topic) => (
                                <tr
                                    key={topic.id}
                                    style={{
                                        borderBottom: '1px solid #e0e0e0'
                                    }}
                                >
                                    <td style={{
                                        padding: '15px',
                                        fontSize: '14px',
                                        color: '#333'
                                    }}>
                                        {topic.id}
                                    </td>
                                    <td style={{
                                        padding: '15px',
                                        fontSize: '14px',
                                        color: '#333',
                                        fontWeight: '500'
                                    }}>
                                        {topic.title}
                                    </td>
                                    <td style={{
                                        padding: '15px',
                                        fontSize: '14px',
                                        color: '#666'
                                    }}>
                                        {getSubjectName(topic.subjectId)}
                                    </td>
                                    <td style={{
                                        padding: '15px',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                            {topic.videoUrl && (
                                                <span style={{
                                                    backgroundColor: '#007bff',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '11px'
                                                }}>
                                                    📹 Video
                                                </span>
                                            )}
                                            {topic.pdfUrl && (
                                                <span style={{
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '11px'
                                                }}>
                                                    📄 PDF
                                                </span>
                                            )}
                                            {topic.externalLink && (
                                                <span style={{
                                                    backgroundColor: '#28a745',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '11px'
                                                }}>
                                                    🔗 Link
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{
                                        padding: '15px',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            gap: '8px',
                                            justifyContent: 'center'
                                        }}>
                                            <button
                                                onClick={() => onEdit(topic)}
                                                className="btn"
                                                style={{
                                                    backgroundColor: '#ffc107',
                                                    color: '#333',
                                                    padding: '6px 12px',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to delete "${topic.title}"?`)) {
                                                        onDelete(topic.id);
                                                    }
                                                }}
                                                className="btn"
                                                style={{
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    padding: '6px 12px',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default TopicList;
