const API_URL = 'http://localhost:8080/api';

const getAuthHeader = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const progressService = {
    // Get student dashboard data
    getDashboardData: async () => {
        const response = await fetch(`${API_URL}/student/dashboard`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        return response.json();
    },

    // Get my progress
    getMyProgress: async () => {
        const response = await fetch(`${API_URL}/progress/me`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error('Failed to fetch progress');
        return response.json();
    },

    // Get progress for specific topic
    getProgressByTopic: async (topicId) => {
        const response = await fetch(`${API_URL}/progress/me/topic/${topicId}`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error('Failed to fetch topic progress');
        return response.json();
    },

    // Get next suggestion
    getNextSuggestion: async () => {
        const response = await fetch(`${API_URL}/progress/me/next-suggestion`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error('Failed to fetch next suggestion');
        return response.json();
    },

    // Get weak areas
    getWeakAreas: async () => {
        const response = await fetch(`${API_URL}/progress/me/weak-areas`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error('Failed to fetch weak areas');
        return response.json();
    }
};
