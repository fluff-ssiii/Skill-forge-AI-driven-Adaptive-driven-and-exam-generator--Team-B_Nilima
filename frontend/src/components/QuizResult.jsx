import React from 'react';
import './QuizResult.css';

function QuizResult({ result, onClose, onRetry }) {
    const getScoreColor = (score) => {
        if (score >= 85) return '#28a745';
        if (score >= 65) return '#ffc107';
        return '#dc3545';
    };

    const getScoreMessage = (score, passed) => {
        if (passed) {
            if (score >= 90) return 'Excellent! Outstanding performance!';
            if (score >= 80) return 'Great job! You did very well!';
            return 'Good work! You passed!';
        }
        return 'Keep practicing! You can do better!';
    };

    return (
        <div className="quiz-result">
            <div className="result-header">
                <div
                    className="score-circle"
                    style={{ borderColor: getScoreColor(result.score) }}
                >
                    <div className="score-value" style={{ color: getScoreColor(result.score) }}>
                        {result.score.toFixed(1)}%
                    </div>
                    <div className="score-label">Your Score</div>
                </div>

                <h2 className={result.passed ? 'passed' : 'failed'}>
                    {result.passed ? '✓ Passed!' : '✗ Not Passed'}
                </h2>

                <p className="score-message">
                    {getScoreMessage(result.score, result.passed)}
                </p>
            </div>

            <div className="result-stats">
                <div className="stat-item">
                    <div className="stat-value">{result.correctAnswers}</div>
                    <div className="stat-label">Correct</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{result.totalQuestions - result.correctAnswers}</div>
                    <div className="stat-label">Incorrect</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{result.totalQuestions}</div>
                    <div className="stat-label">Total</div>
                </div>
            </div>

            <div className="next-difficulty">
                <h3>Next Difficulty Level</h3>
                <div className={`difficulty-badge ${result.nextDifficulty.toLowerCase()}`}>
                    {result.nextDifficulty}
                </div>
                <p className="difficulty-message">
                    {result.nextDifficulty === 'HARD' && 'You\'re ready for harder challenges!'}
                    {result.nextDifficulty === 'MEDIUM' && 'You\'ll continue with medium difficulty.'}
                    {result.nextDifficulty === 'EASY' && 'Let\'s practice more with easier questions.'}
                </p>
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
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default QuizResult;
