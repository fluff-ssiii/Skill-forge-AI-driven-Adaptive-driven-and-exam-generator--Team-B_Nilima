import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { studentQuizService } from '../services/studentQuizService';
import './InstructorStudentPerformance.css';

function InstructorStudentPerformance() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                // fetch student profile (defensive)
                let profile = null;
                try {
                    const res = await fetch(`http://localhost:8080/api/students/${studentId}`, {
                        headers: { 'Authorization': `Bearer ${authService.getToken()}` }
                    });
                    if (res.ok) profile = await res.json();
                } catch (e) {
                    // ignore profile error
                }

                const progress = await studentQuizService.getProgress(studentId);
                if (mounted) {
                    setStudent(profile || { id: studentId, name: profile?.name || `Student ${studentId}`, email: profile?.email || '—' });
                    setStats(progress || {});
                }
            } catch (err) {
                console.error(err);
                if (mounted) setError('Failed to load student performance');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [studentId]);

    const safeNumber = (n, fallback = 0) => { const v = Number(n); return Number.isFinite(v) ? v : fallback };

    const getBucket = (pct) => {
        if (pct < 50) return { label: 'Low', color: '#dc3545' };
        if (pct <= 75) return { label: 'Average', color: '#fd7e14' };
        if (pct < 90) return { label: 'Good', color: '#0d6efd' };
        return { label: 'Excellent', color: '#28a745' };
    };

    // derive summary values from stats.attempts
    const attempts = stats?.attempts || [];
    const totalAttempts = safeNumber(stats?.totalAttempts, attempts.length);
    const avgScore = safeNumber(stats?.avgScore, (() => {
        if (attempts.length === 0) return 0;
        const vals = attempts.map(a => Number(a.score ?? 0));
        return Math.round(vals.reduce((s,n)=>s+n,0)/vals.length);
    })());
    const accuracy = safeNumber(stats?.accuracy, (() => {
        if (attempts.length === 0) return 0;
        const vals = attempts.map(a => {
            const total = Number(a.totalQuestions ?? a.total ?? 0) || 0;
            return total>0 ? Math.round((Number(a.score||0)/total)*100) : Number(a.percentage ?? a.accuracy ?? 0);
        });
        return Math.round(vals.reduce((s,n)=>s+n,0)/vals.length);
    })());
    const highest = attempts.reduce((mx,a)=> Math.max(mx, Number(a.score??0)), 0);

    // topic-wise aggregation
    const topicMap = {};
    attempts.forEach(a => {
        const topic = a.quiz?.topic?.title || a.topicName || a.quiz?.title || 'General';
        topicMap[topic] = topicMap[topic] || { totalPct: 0, count: 0 };
        const total = Number(a.totalQuestions ?? a.total ?? 0) || 0;
        const pct = total>0 ? Math.round((Number(a.score||0)/total)*100) : Number(a.percentage ?? a.accuracy ?? 0);
        topicMap[topic].totalPct += Number.isFinite(pct) ? pct : 0;
        topicMap[topic].count += 1;
    });
    const topicRows = Object.keys(topicMap).map(k => ({ topic: k, attempts: topicMap[k].count, avg: topicMap[k].count?Math.round(topicMap[k].totalPct/topicMap[k].count):0 }));

    const strengths = topicRows.filter(r => r.avg >= 75).map(r => r.topic);
    const weaknesses = topicRows.filter(r => r.avg < 50).map(r => r.topic);

    return (
        <div className="content-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Student Performance</h2>
                <div>
                    <button className="btn btn-secondary" onClick={() => navigate('/instructor/students')}>Back to Students</button>
                </div>
            </div>

            {loading ? <p>Loading...</p> : error ? <div className="alert alert-error">{error}</div> : (
                <>
                    <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                        <div className="card" style={{ maxWidth: 420 }}>
                            <div className="card-header">
                                <h3 className="card-title" style={{ fontSize: 20 }}>{student?.name}</h3>
                                <p className="card-subtitle">{student?.email}</p>
                            </div>
                            <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
                                <div><strong>Current Course:</strong> {stats?.currentCourse || stats?.courseName || '—'}</div>
                                <div><strong>Current Level:</strong> {accuracy < 50 ? 'Beginner' : (accuracy <= 75 ? 'Medium' : (accuracy < 90 ? 'Advanced' : 'Expert'))}</div>
                                <div><strong>Overall Status:</strong> {accuracy >= 50 ? 'Passed' : 'Needs Improvement'}</div>
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', gap: 12 }}>
                            <div className="card">
                                <div className="card-title">Total Quizzes Attempted</div>
                                <div className="card-value">{totalAttempts}</div>
                            </div>
                            <div className="card">
                                <div className="card-title">Average Score</div>
                                <div className="card-value">{avgScore}%</div>
                            </div>
                            <div className="card">
                                <div className="card-title">Overall Accuracy</div>
                                <div className="card-value">{accuracy}%</div>
                            </div>
                            <div className="card">
                                <div className="card-title">Highest Score</div>
                                <div className="card-value">{highest}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 18 }}>
                        <h3>Topic-wise Performance</h3>
                        {topicRows.length === 0 ? (
                            <div className="no-data">No topic data available.</div>
                        ) : (
                            <div className="card" style={{ padding: 12 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8, padding: '8px 12px', borderBottom: '1px solid #eef2f7', fontWeight: 700 }}>
                                    <div>Topic</div>
                                    <div>Attempts</div>
                                    <div>Accuracy</div>
                                </div>
                                {topicRows.map((r, i) => (
                                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8, padding: '10px 12px', alignItems: 'center' }}>
                                        <div>{r.topic}</div>
                                        <div>{r.attempts}</div>
                                        <div>
                                            <span style={{ fontWeight: 700, color: getBucket(r.avg).color }}>{r.avg}%</span>
                                            <span className="status-badge" style={{ marginLeft: 8, background: getBucket(r.avg).color, color: '#fff', padding: '4px 8px', borderRadius: 8 }}>{r.avg >= 75 ? 'Strong' : (r.avg < 50 ? 'Weak' : 'Average')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: 18 }}>
                        <h3>Quiz History</h3>
                        {attempts.length === 0 ? (
                            <div className="no-data">No attempts yet.</div>
                        ) : (
                            <div className="card" style={{ padding: 12 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1fr', gap: 8, padding: '8px 12px', borderBottom: '1px solid #eef2f7', fontWeight: 700 }}>
                                    <div>Quiz</div>
                                    <div>Score</div>
                                    <div>Percentage</div>
                                    <div>Date</div>
                                    <div>Status</div>
                                </div>
                                {attempts.map((a, idx) => {
                                    const score = Number(a.score ?? 0);
                                    const total = Number(a.totalQuestions ?? a.total ?? 0) || 0;
                                    const pct = total>0?Math.round((score/total)*100):Math.round(Number(a.percentage??a.accuracy??0));
                                    const bucket = getBucket(pct);
                                    const dateStr = a.attemptedAt ? new Date(a.attemptedAt).toLocaleString() : (a.date ? new Date(a.date).toLocaleString() : '—');
                                    return (
                                        <div key={a.id||idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1fr', gap: 8, padding: '10px 12px', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
                                            <div>{a.quiz?.title || a.name || `Quiz ${idx+1}`}</div>
                                            <div>{score} / {total}</div>
                                            <div style={{ color: bucket.color, fontWeight: 700 }}>{pct}%</div>
                                            <div>{dateStr}</div>
                                            <div><span className="status-badge" style={{ background: bucket.color }}>{pct >= 75 ? 'Good' : (pct < 50 ? 'Low' : 'Average')}</span></div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: 18 }}>
                        <h3>Instructor Insights</h3>
                        <div className="card" style={{ padding: 12 }}>
                            <p>
                                {strengths.length > 0 ? `Strengths: ${strengths.join(', ')}.` : 'No clear strengths.'}
                            </p>
                            <p>
                                {weaknesses.length > 0 ? `Weaknesses: ${weaknesses.join(', ')}.` : 'No clear weaknesses.'}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default InstructorStudentPerformance;
