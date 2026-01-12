import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { studentQuizService } from '../services/studentQuizService';
import QuizTaker from '../components/QuizTaker';
import QuizResult from '../components/QuizResult';
import './StudentQuizzes.css';

function StudentQuizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [quizResult, setQuizResult] = useState(null);

    const user = authService.getCurrentUser()?.user || authService.getCurrentUser();
    const studentId = user?.userId || user?.id || user?.userId;

    useEffect(() => {
        fetchAssignedQuizzes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchAssignedQuizzes = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8080/api/students/${studentId}/assignments`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            console.log('Assigned quizzes response:', data);

            // Be tolerant of response shape: prefer array, otherwise try common container fields
            const list = Array.isArray(data)
                ? data
                : (data.assignedQuizzes || data.assignments || data.quizzes || []);

            setQuizzes(list || []);
        } catch (err) {
            console.error('Failed to fetch assigned quizzes', err);
            setError('Failed to load assigned quizzes. See console for details.');
        } finally {
            setLoading(false);
        }
    };

    const onStart = async (quiz) => {
        try {
            setLoading(true);
            const quizId = quiz.id || quiz.quizId || (quiz.quiz && quiz.quiz.id);
            if (!quizId) throw new Error('Cannot determine quiz id to start');
            const resp = await studentQuizService.generateQuiz(studentId, { quizId });
            console.log('generateQuiz response:', resp);

            const mapped = {
                id: resp.quiz?.id || resp.id || quizId,
                title: resp.quiz?.title || resp.quiz?.topic?.title || resp.title || `Quiz ${quizId}`,
                timeLimit: resp.timeLimit || resp.quiz?.timeLimit || 15,
                questions: Array.isArray(resp.questions)
                    ? resp.questions.map(q => ({
                        id: q.id || q.questionId,
                        questionText: q.question || q.questionText,
                        optionA: q.optionA || q.options?.[0] || null,
                        optionB: q.optionB || q.options?.[1] || null,
                        optionC: q.optionC || q.options?.[2] || null,
                        optionD: q.optionD || q.options?.[3] || null,
                    }))
                    : (resp.quiz?.questions || []),
            };

            setCurrentQuiz(mapped);
        } catch (err) {
            console.error('Failed to start quiz', err);
            setError('Failed to start quiz. See console for details.');
        } finally {
            setLoading(false);
        }
    };

    const handleQuizSubmit = async (submission) => {
        try {
            setLoading(true);
            const result = await studentQuizService.submitQuiz(studentId, submission.quizId || submission.id || submission.quiz?.id, submission);
            setQuizResult(result);
            setCurrentQuiz(null);
            // refresh list after submit
            fetchAssignedQuizzes();
        } catch (err) {
            console.error('Error submitting quiz:', err);
            setError('Failed to submit quiz. See console.');
        } finally {
            setLoading(false);
        }
    };

    const handleQuizCancel = () => {
        if (window.confirm('Cancel this quiz? Progress will be lost.')) setCurrentQuiz(null);
    };

    const handleResultClose = () => {
        setQuizResult(null);
        fetchAssignedQuizzes();
    };

    return (
        <div className="page-quizzes">
            <div style={{ maxWidth: 1100 }}>
                <div className="quizzes-header">
                    <h2>Assigned Quizzes</h2>
                </div>
                {error && <div className="quizzes-error">{error}</div>}
            {!currentQuiz && !quizResult && (
                <>
                    {loading && <p>Loading assigned quizzes...</p>}
                    {!loading && quizzes.length === 0 && <p>No assigned quizzes found.</p>}

                    <div className="quizzes-grid">
                        {quizzes.map((q, i) => {
                            const title = q.title || q.name || (q.quiz && q.quiz.title) || `Quiz ${i + 1}`;
                            const duration = q.duration || q.timeLimit || (q.quiz && q.quiz.timeLimit) || '—';
                            const status = (q.status || q.state || 'Assigned').toString();
                            return (
                                <div key={q.id || q.quizId || i} className="quiz-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3>{title}</h3>
                                        <div className="status-pill">{status}</div>
                                    </div>

                                    <div className="quiz-meta">
                                        <div><strong>Course:</strong> {q.courseName || '—'}</div>
                                        <div><strong>Duration:</strong> {duration}</div>
                                    </div>

                                    <div className="quiz-actions">
                                        <button className="btn-start" onClick={() => onStart(q)}>Start Quiz</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {currentQuiz && (
                <div className="dashboard-layout">
                    <div className="main-content" style={{ marginLeft: 0, width: '100%' }}>
                        <QuizTaker
                            quiz={currentQuiz}
                            onSubmit={handleQuizSubmit}
                            onCancel={handleQuizCancel}
                        />
                    </div>
                </div>
            )}

            {quizResult && (
                <div className="dashboard-layout">
                    <div className="main-content" style={{ marginLeft: 0, width: '100%' }}>
                        <QuizResult
                            result={quizResult}
                            onClose={handleResultClose}
                            onRetry={() => { setQuizResult(null); }}
                        />
                    </div>
                </div>
            )}
        </div>
    </div>
    );
}

export default StudentQuizzes;
