import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { studentQuizService } from '../services/studentQuizService';
import './Performance.css';

function Performance() {
    const user = authService.getCurrentUser();
    const studentId = user?.userId || user?.id || user?.user?.id;
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await studentQuizService.getProgress(studentId);
                if (mounted) setStats(data || {});
            } catch (err) {
                console.error(err);
                if (mounted) setError('Failed to load performance');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [studentId]);

    // Draw charts whenever stats update
    useEffect(() => {
        if (!stats) return;
        // delay briefly to ensure canvas in DOM
        setTimeout(() => drawCharts(stats), 50);
    }, [stats]);

    // Grading helpers (same rules as QuizResult)
    const getBucketLabel = (pct) => {
        if (pct < 50) return 'Low / Below Average';
        if (pct <= 75) return 'Average';
        if (pct < 90) return 'Good';
        if (pct <= 95) return 'Very Good';
        return 'Top 1% / Excellent';
    };

    const getBucketColor = (pct) => {
        if (pct >= 90) return '#28a745';
        if (pct >= 75) return '#0d6efd';
        if (pct >= 50) return '#fd7e14';
        return '#dc3545';
    };

    const safeNumber = (n, fallback = 0) => {
        const num = Number(n);
        return Number.isFinite(num) ? num : fallback;
    };

    // Render
    return (
        <div className="performance-page">
            <div className="performance-header">
                <h2>Your Performance</h2>
                {loading && <div className="muted">Loading...</div>}
                {error && <div className="error">{error}</div>}
            </div>

            {!loading && !error && (
                <>
                    <div className="summary-cards">
                        <div className="card">
                            <div className="card-icon">🎯</div>
                            <div className="card-body">
                                <div className="card-title">Total Attempts</div>
                                <div className="card-value">{safeNumber(stats?.totalAttempts, 0)}</div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-icon">📈</div>
                            <div className="card-body">
                                <div className="card-title">Average Score</div>
                                <div className="card-value">{safeNumber(stats?.avgScore, 0)}%</div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-icon">🔍</div>
                            <div className="card-body">
                                <div className="card-title">Accuracy</div>
                                {(() => {
                                    const acc = safeNumber(stats?.accuracy, 0);
                                    const color = getBucketColor(acc);
                                    return (
                                        <div className="card-value-row">
                                            <div className="card-value" style={{ color }}>{acc}%</div>
                                            <div className="card-badge" style={{ background: color }}>{getBucketLabel(acc)}</div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>

                    <div className="attempts-section">
                        <h3>Attempts History</h3>
                        {(!stats?.attempts || stats.attempts.length === 0) ? (
                            <div className="no-data">No attempts yet. Take quizzes to see your history here.</div>
                        ) : (
                            <div className="attempts-table">
                                <div className="attempts-head">
                                    <div>Quiz</div>
                                    <div>Score</div>
                                    <div>Percentage</div>
                                    <div>Date</div>
                                    <div>Status</div>
                                </div>
                                {stats.attempts.map((a, idx) => {
                                    const score = safeNumber(a.score, 0);
                                    const totalQ = safeNumber(a.totalQuestions ?? a.total ?? (a.questionCount), 0);
                                    const pct = totalQ > 0 ? Math.round((score / totalQ) * 100) : safeNumber(a.percentage ?? a.accuracy ?? 0);
                                    const color = getBucketColor(pct);
                                    const status = getBucketLabel(pct);
                                    const dateStr = a.attemptedAt ? new Date(a.attemptedAt).toLocaleString() : (a.date ? new Date(a.date).toLocaleString() : '—');

                                    return (
                                        <div key={a.id || idx} className="attempt-row" title={a.quiz?.title || a.name || 'Quiz Attempt'}>
                                            <div className="attempt-quiz">{a.quiz?.title || a.name || `Quiz ${idx + 1}`}</div>
                                            <div className="attempt-score">{score} / {totalQ}</div>
                                            <div className="attempt-pct">
                                                <div className="pct-text" style={{ color }}>{pct}%</div>
                                                <div className="pct-bar" aria-hidden>
                                                    <div className="pct-fill" style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} />
                                                </div>
                                            </div>
                                            <div className="attempt-date">{dateStr}</div>
                                            <div className="attempt-status"><span className="status-badge" style={{ background: color }}>{status}</span></div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    {/* Charts & Instructor View */}
                    <div className="insights-section">
                        <div className="charts-grid">
                            <div className="chart-card">
                                <h4>Topic-wise Performance</h4>
                                <canvas id="topicPie" width="300" height="300" />
                                <div className="chart-legend" id="topicLegend" />
                            </div>

                            <div className="chart-card">
                                <h4>Adaptive Level Trend</h4>
                                <canvas id="trendLine" width="500" height="260" />
                                <div className="trend-legend">Beginner → Advanced</div>
                            </div>
                        </div>

                        <div className="instructor-card">
                            <h4>Student Strengths & Weaknesses (by Topic)</h4>
                            <div className="strengths-table">
                                <div className="strengths-head"><div>Topic</div><div>Avg %</div><div>Assessment</div></div>
                                {(() => {
                                    const attempts = stats?.attempts || [];
                                    const grouped = {};
                                    attempts.forEach(a => {
                                        const topic = a.quiz?.topic?.title || a.topicName || a.quiz?.title || 'General';
                                        grouped[topic] = grouped[topic] || { total: 0, count: 0 };
                                        const score = Number(a.score ?? 0);
                                        const total = Number(a.totalQuestions ?? a.total ?? 0) || 0;
                                        const pct = total > 0 ? (score / total) * 100 : Number(a.percentage ?? a.accuracy ?? 0);
                                        grouped[topic].total += Number.isFinite(pct) ? pct : 0;
                                        grouped[topic].count += 1;
                                    });
                                    const rows = Object.keys(grouped).map(t => ({ topic: t, avg: grouped[t].count ? Math.round(grouped[t].total / grouped[t].count) : 0 }));
                                    if (rows.length === 0) return <div className="no-data">No topic data available.</div>;
                                    return rows.map((r, idx) => (
                                        <div className="strengths-row" key={idx}>
                                            <div className="topic-name">{r.topic}</div>
                                            <div className="topic-avg">{r.avg}%</div>
                                            <div className="topic-assess"><span className="status-badge" style={{ background: getBucketColor(r.avg) }}>{r.avg >= 75 ? 'Strength' : 'Weakness'}</span></div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Performance;

// Chart rendering side-effects
// Keep separate so React render stays pure. Uses plain Canvas API to avoid new deps.
function drawCharts(stats) {
    if (!stats) return;
    try {
        const attempts = stats.attempts || [];

        // Topic pie: count attempts per topic
        const topicMap = {};
        attempts.forEach(a => {
            const topic = a.quiz?.topic?.title || a.topicName || a.quiz?.title || 'General';
            topicMap[topic] = (topicMap[topic] || 0) + 1;
        });
        const topicCanvas = document.getElementById('topicPie');
        const legendEl = document.getElementById('topicLegend');
        if (topicCanvas && topicCanvas.getContext) {
            const ctx = topicCanvas.getContext('2d');
            ctx.clearRect(0, 0, topicCanvas.width, topicCanvas.height);
            const items = Object.keys(topicMap);
            const total = items.reduce((s, k) => s + topicMap[k], 0) || 1;
            let start = 0;
            legendEl && (legendEl.innerHTML = '');
            items.forEach((k, i) => {
                const value = topicMap[k];
                const slice = (value / total) * Math.PI * 2;
                const color = ['#0d6efd','#28a745','#fd7e14','#6f42c1','#20c997','#dc3545'][i % 6];
                ctx.beginPath();
                ctx.moveTo(150,150);
                ctx.arc(150,150,100,start,start+slice);
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();
                // legend
                if (legendEl) {
                    const span = document.createElement('div');
                    span.style.display = 'flex';
                    span.style.alignItems = 'center';
                    span.style.gap = '8px';
                    span.style.marginTop = '6px';
                    span.innerHTML = `<span style="display:inline-block;width:12px;height:12px;background:${color};border-radius:3px"></span><span>${k} (${value})</span>`;
                    legendEl.appendChild(span);
                }
                start += slice;
            });
        }

        // Trend line: map attempts over time to level values
        const trendCanvas = document.getElementById('trendLine');
        if (trendCanvas && trendCanvas.getContext) {
            const ctx = trendCanvas.getContext('2d');
            ctx.clearRect(0,0,trendCanvas.width,trendCanvas.height);
            const sorted = attempts.slice().filter(a=>a.attemptedAt||a.date||a.createdAt).sort((a,b)=>new Date(a.attemptedAt||a.date||a.createdAt)-new Date(b.attemptedAt||b.date||b.createdAt));
            if (sorted.length === 0) return;
            const points = sorted.map(a => {
                const total = Number(a.totalQuestions ?? a.total ?? 0) || 0;
                const score = Number(a.score ?? 0);
                const pct = total>0?Math.round((score/total)*100):Math.round(Number(a.percentage??a.accuracy??0));
                // level: 1..4
                const level = pct < 50 ? 1 : (pct <=75 ? 2 : (pct < 90 ? 3 : 4));
                return { t: new Date(a.attemptedAt||a.date||a.createdAt).getTime(), level, pct };
            });
            const times = points.map(p=>p.t);
            const minT = Math.min(...times);
            const maxT = Math.max(...times);
            const w = trendCanvas.width; const h = trendCanvas.height; const pad = 30;
            // draw axes
            ctx.strokeStyle = '#e6edf3'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(pad,h-pad); ctx.lineTo(w-pad,h-pad); ctx.stroke(); // x
            ctx.beginPath(); ctx.moveTo(pad,pad); ctx.lineTo(pad,h-pad); ctx.stroke(); // y
            // plot
            ctx.lineWidth = 2; ctx.strokeStyle = '#0d6efd'; ctx.beginPath();
            points.forEach((p,i)=>{
                const x = pad + ((p.t - minT)/(maxT - minT || 1))*(w-2*pad);
                const y = pad + (1 - (p.level-1)/3)*(h-2*pad);
                if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
            });
            ctx.stroke();
            // dots
            points.forEach(p=>{
                const x = pad + ((p.t - minT)/(maxT - minT || 1))*(w-2*pad);
                const y = pad + (1 - (p.level-1)/3)*(h-2*pad);
                ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fillStyle = getLevelColor(p.level); ctx.fill();
            });
            // y labels
            ctx.fillStyle = '#374151'; ctx.font = '12px sans-serif';
            ['Beginner','Medium','Hard','Advanced'].forEach((lab,i)=>{
                const y = pad + (1 - i/3)*(h-2*pad);
                ctx.fillText(lab, 6, y+4);
            });
        }
    } catch (e) {
        // swallow chart errors
        console.warn('Chart draw failed', e);
    }
}

function getLevelColor(level) {
    if (level <= 1) return '#dc3545';
    if (level === 2) return '#fd7e14';
    if (level === 3) return '#0d6efd';
    return '#28a745';
}

// Hook into DOM updates
setTimeout(()=>{
    // Observe stats changes by polling DOM for canvas presence; when found, attempt to draw using global window.statsIfNeeded
    // This is a lightweight approach because this file is compiled into the SPA; drawing will be triggered by the component's effect below as well.
},0);
