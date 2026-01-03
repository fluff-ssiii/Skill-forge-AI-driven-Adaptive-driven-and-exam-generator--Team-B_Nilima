import React from 'react';
import './ProgressCard.css';

function ProgressCard({ progress, onClick }) {
    const getBackgroundColor = (score) => {
        if (score >= 85) return '#d4edda'; // Green
        if (score >= 65) return '#fff3cd'; // Yellow
        return '#f8d7da'; // Red/Pink
    };

    const getTextColor = (score) => {
        if (score >= 85) return '#155724';
        if (score >= 65) return '#856404';
        return '#721c24';
    };

    return (
        <div
            className="progress-card"
            style={{
                backgroundColor: getBackgroundColor(progress.quizScore),
                color: getTextColor(progress.quizScore)
            }}
            onClick={() => onClick && onClick(progress.topicId)}
        >
            <div className="progress-card-content">
                <p className="progress-card-label">
                    <strong>Topic ID:</strong> {progress.topicId}
                </p>
                <p className="progress-card-label">
                    <strong>Score:</strong> {progress.quizScore}
                </p>
                <p className="progress-card-label">
                    <strong>Next Difficulty:</strong> {progress.difficulty}
                </p>
            </div>
        </div>
    );
}

export default ProgressCard;
