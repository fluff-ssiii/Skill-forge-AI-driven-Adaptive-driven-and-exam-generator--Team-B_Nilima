import React from 'react';
import './QuizResult.css';

function QuizResult({ result = {}, onClose, onRetry }) {
    const totalQuestions = Number(result.totalQuestions ?? result.total ?? (result.questionResults ? result.questionResults.length : 0) ?? 0);
    const correct = Number(result.correctAnswers ?? result.correct_answers ?? result.correct ?? result.score ?? NaN);

    // Calculate percentage defensively: prefer using number of correct answers when available.
    let percentage = 0;
    if (totalQuestions === 0) {
        percentage = 0;
    } else if (!Number.isNaN(correct)) {
        percentage = Math.round((correct / totalQuestions) * 100);
    } else if (result.score != null) {
        // Fallback: score might already be a percentage or fraction
        const raw = Number(result.score);
        if (!Number.isNaN(raw)) {
            if (raw <= 1) percentage = Math.round(raw * 100);
            else if (raw <= 100) percentage = Math.round(raw);
            else percentage = 0;
        }
    }

    const getScoreColor = (pct) => {
        if (pct >= 90) return '#28a745'; // green
        if (pct >= 75) return '#0d6efd'; // blue
        if (pct >= 50) return '#fd7e14'; // orange
        return '#dc3545'; // red
    };

    const getStatusLabel = (pct) => {
        if (pct < 50) return 'Low / Below Average';
        if (pct <= 75) return 'Average';
        if (pct < 90) return 'Good';
        if (pct <= 95) return 'Very Good';
        return 'Top 1% / Excellent';
    };

    const statusLabel = getStatusLabel(percentage);

    const getScoreMessage = (pct) => {
        if (pct > 95) return 'Outstanding — top performer!';
        if (pct >= 90) return 'Very strong performance.';
        if (pct >= 76) return 'Good work — keep it up.';
        if (pct >= 50) return 'Satisfactory — room to improve.';
        return 'Needs improvement — practice more.';
    };

    const mapNextDifficulty = (pct) => {
        if (pct < 50) return 'EASY';
        if (pct <= 75) return 'MEDIUM';
        if (pct < 90) return 'HARD';
        return 'ADVANCED';
    };

    const nextDifficulty = mapNextDifficulty(percentage);

    return (
        <div className="quiz-result">
            <div className="result-header">
                <div
                    className="score-circle"
                    style={{ borderColor: getScoreColor(percentage) }}
                >
                    <div className="score-value" style={{ color: getScoreColor(percentage) }}>
                        {Number.isFinite(percentage) ? `${percentage}%` : '0%'}
                    </div>
                    <div className="score-label">Your Score</div>
                </div>

                <h2 className={`status ${statusLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                    {statusLabel}
                </h2>

                <p className="score-message">
                    {getScoreMessage(percentage)}
                </p>
            </div>

                <div className="result-stats">
                <div className="stat-item">
                    <div className="stat-value">{correct ?? '—'}</div>
                    <div className="stat-label">Correct</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{(totalQuestions && correct != null) ? (totalQuestions - correct) : '—'}</div>
                    <div className="stat-label">Incorrect</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{totalQuestions}</div>
                    <div className="stat-label">Total</div>
                </div>
            </div>

            <div className="next-difficulty">
                <h3>Next Quiz Difficulty</h3>
                <div className={`difficulty-badge ${String(nextDifficulty).toLowerCase()}`} style={{ background: getScoreColor(percentage), color: '#fff', display: 'inline-block', padding: '6px 10px', borderRadius: 6 }}>
                    {nextDifficulty}
                </div>
            </div>

            {result.questionResults && result.questionResults.length > 0 && (
                <div className="question-review">
                    <h3>Question Review</h3>
                    {result.questionResults.map((qr, index) => (
                        <div key={index} className={`review-item ${qr.isCorrect ? 'correct' : 'incorrect'}`}>
                            <div className="review-header">
                                <span className="question-number">Q{index + 1}</span>
                                <span className={`result-icon ${qr.isCorrect ? 'correct' : 'incorrect'}`}>
                                    {qr.isCorrect ? '✓' : '✗'}
                                </span>
                            </div>
                            <p className="review-question">{qr.questionText}</p>
                            <div className="review-answers">
                                <p>
                                    <strong>Your answer:</strong>
                                    <span className={qr.isCorrect ? 'correct-answer' : 'wrong-answer'}>
                                        {qr.selectedAnswer || 'Not answered'}
                                    </span>
                                </p>
                                {!qr.isCorrect && (
                                    <p>
                                        <strong>Correct answer:</strong>
                                        <span className="correct-answer">{qr.correctAnswer}</span>
                                    </p>
                                )}
                            </div>
                            {qr.explanation && (
                                <div className="explanation">
                                    <strong>Explanation:</strong> {qr.explanation}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="result-actions">
                {onRetry && (
                    <button className="retry-btn" onClick={onRetry}>
                        Try Again
                    </button>
                )}
                <button className="close-btn" onClick={onClose}>
                    Back to Assigned Quizzes
                </button>
            </div>
        </div>
    );
}

export default QuizResult;
