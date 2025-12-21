function StudentList({ students, onEdit, onDelete }) {
    return (
        <div style={{ maxWidth: '900px', margin: '20px auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
                All Students
            </h2>

            {students.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#666', fontSize: '16px' }}>
                        No students available. Add your first student!
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
                                    Name
                                </th>
                                <th style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    color: '#333'
                                }}>
                                    Email
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
                            {students.map((student) => (
                                <tr
                                    key={student.id}
                                    style={{
                                        borderBottom: '1px solid #e0e0e0'
                                    }}
                                >
                                    <td style={{
                                        padding: '15px',
                                        fontSize: '14px',
                                        color: '#333'
                                    }}>
                                        {student.id}
                                    </td>
                                    <td style={{
                                        padding: '15px',
                                        fontSize: '14px',
                                        color: '#333'
                                    }}>
                                        {student.name}
                                    </td>
                                    <td style={{
                                        padding: '15px',
                                        fontSize: '14px',
                                        color: '#666'
                                    }}>
                                        {student.email}
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
                                                onClick={() => onEdit(student)}
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
                                                    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
                                                        onDelete(student.id);
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

export default StudentList;
