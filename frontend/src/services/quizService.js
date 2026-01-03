const API_URL = 'http://localhost:8080/api/quizzes';

const getAuthHeader = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const quizService = {
    // Instructor: Create quiz
    createQuiz: async (quizData) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(quizData)
        });
        if (!response.ok) throw new Error('Failed to create quiz');
        return response.json();
    },

    // Instructor: Generate quiz with AI
    generateQuizWithAI: async (request) => {
        const response = await fetch(`${API_URL}/generate-ai`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(request)
        });
        if (!response.ok) throw new Error('Failed to generate quiz');
        return response.json();
    },

    // Get quiz by ID
    getQuizById: async (quizId) => {
        const response = await fetch(`${API_URL}/${quizId}`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error('Failed to fetch quiz');
        return response.json();
    },

    // Get quizzes by topic
    getQuizzesByTopic: async (topicId) => {
        const response = await fetch(`${API_URL}/topic/${topicId}`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error('Failed to fetch quizzes');
        return response.json();
    },

    // Student: Get adaptive quiz for topic
    getAdaptiveQuiz: async (topicId) => {
        const response = await fetch(`${API_URL}/adaptive/topic/${topicId}`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error('Failed to fetch adaptive quiz');
        return response.json();
    },

    // Student: Submit quiz
    submitQuiz: async (submission) => {
        const response = await fetch(`${API_URL}/submit`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(submission)
        });
        if (!response.ok) throw new Error('Failed to submit quiz');
        return response.json();
    },

    // Get my quiz attempts
    getMyAttempts: async () => {
        const response = await fetch(`${API_URL}/attempts/me`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error('Failed to fetch attempts');
        return response.json();
    },

    // Update quiz
    updateQuiz: async (quizId, quizData) => {
        const response = await fetch(`${API_URL}/${quizId}`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify(quizData)
        });
        if (!response.ok) throw new Error('Failed to update quiz');
        return response.json();
    },

    // Delete quiz
    deleteQuiz: async (quizId) => {
        const response = await fetch(`${API_URL}/${quizId}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error('Failed to delete quiz');
    }
};
