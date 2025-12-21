function SubjectList({ subjects, onEdit, onDelete }) {
    return (
        <div style={{ maxWidth: '900px', margin: '20px auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
                All Subjects
            </h2>

            {subjects.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#666', fontSize: '16px' }}>
                        No subjects available. Create your first subject!
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
                                    color: '#333',
                                    width: '10%'
                                }}>
                                    ID
                                </th>
                                <th style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    color: '#333',
                                    width: '25%'
                                }}>
                                    Subject Name
                                </th>
                                <th style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    color: '#333',
                                    width: '45%'
                                }}>
                                    Description
                                </th>
                                <th style={{
                                    padding: '15px',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    color: '#333',
                                    width: '20%'
                                }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject) => (
                                <tr
                                    key={subject.id}
                                    style={{
                                        borderBottom: '1px solid #e0e0e0'
                                    }}
                                >
                                    <td style={{
                                        padding: '15px',
                                        fontSize: '14px',
                                        color: '#333'
                                    }}>
                                        {subject.id}
                                    </td>
                                    <td style={{
                                        padding: '15px',
                                        fontSize: '14px',
                                        color: '#333',
                                        fontWeight: '500'
                                    }}>
                                        {subject.name}
                                    </td>
                                    <td style={{
                                        padding: '15px',
                                        fontSize: '14px',
                                        color: '#666'
                                    }}>
                                        {subject.description}
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
                                                onClick={() => onEdit(subject)}
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
                                                    if (window.confirm(`Are you sure you want to delete "${subject.name}"?`)) {
                                                        onDelete(subject.id);
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

export default SubjectList;
