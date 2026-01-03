import React from 'react';
import './TopicDetailModal.css';

function TopicDetailModal({ topic, onClose }) {
    if (!topic) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{topic.title}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <p className="topic-difficulty">
                        <strong>Difficulty:</strong> {topic.difficulty || 'N/A'}
                    </p>

                    {topic.videoUrl && (
                        <div className="video-section">
                            <p><strong>Video:</strong></p>
                            <video controls width="100%" className="topic-video">
                                <source src={topic.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}

                    {topic.pdfUrl && (
                        <div className="pdf-section">
                            <p><strong>PDF:</strong></p>
                            <a
                                href={topic.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pdf-link"
                            >
                                View PDF
                            </a>
                        </div>
                    )}

                    {topic.externalLink && (
                        <div className="external-link-section">
                            <p><strong>External Link:</strong></p>
                            <a
                                href={topic.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="external-link"
                            >
                                {topic.externalLink}
                            </a>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="close-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default TopicDetailModal;
