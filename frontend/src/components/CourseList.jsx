function CourseList({ courses, onEdit, onDelete }) {
    const getDifficultyColor = (level) => {
        switch (level) {
            case 'EASY': return '#28a745';
            case 'MEDIUM': return '#ffc107';
            case 'HARD': return '#dc3545';
            default: return '#666';
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '20px auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
                All Courses
            </h2>

            {courses.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#666', fontSize: '16px' }}>
                        No courses available. Create your first course!
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
                                    Course Title
                                </th>
                                <th style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    color: '#333'
                                }}>
                                    Difficulty
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
                            {courses.map((course) => (
                                <tr
                                    key={course.id}
                                    style={{
                                        borderBottom: '1px solid #e0e0e0'
                                    }}
                                >
                                    <td style={{
                                        padding: '15px',
                                        fontSize: '14px',
                                        color: '#333'
                                    }}>
                                        {course.id}
                                    </td>
                                    <td style={{
                                        padding: '15px',
                                        fontSize: '14px',
                                        color: '#333',
                                        fontWeight: '500'
                                    }}>
                                        {course.title}
                                    </td>
                                    <td style={{
                                        padding: '15px',
                                        fontSize: '14px'
                                    }}>
                                        <span style={{
                                            backgroundColor: getDifficultyColor(course.difficultyLevel),
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {course.difficultyLevel}
                                        </span>
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
                                                onClick={() => onEdit(course)}
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
                                                    if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
                                                        onDelete(course.id);
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

export default CourseList;
