const API_URL = 'http://localhost:8080/api/topics';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const topicService = {
    getAllTopics: async () => {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                }
            });
            if (!response.ok) throw new Error('Failed to fetch topics');
            return await response.json();
        } catch (error) {
            console.error('Error fetching topics:', error);
            throw error;
        }
    },

    getTopicsBySubject: async (subjectId) => {
        try {
            const response = await fetch(`${API_URL}/subject/${subjectId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                }
            });
            if (!response.ok) throw new Error('Failed to fetch subject topics');
            return await response.json();
        } catch (error) {
            console.error('Error fetching subject topics:', error);
            throw error;
        }
    },

    createTopic: async (topicData) => {
        try {
            const formData = new FormData();
            formData.append('subjectId', topicData.subjectId);
            formData.append('title', topicData.title);
            if (topicData.externalLink) {
                formData.append('externalLink', topicData.externalLink);
            }
            if (topicData.video) {
                formData.append('video', topicData.video);
            }
            if (topicData.pdf) {
                formData.append('pdf', topicData.pdf);
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    ...getAuthHeader()
                },
                body: formData
            });
            if (!response.ok) throw new Error('Failed to create topic');
            return await response.json();
        } catch (error) {
            console.error('Error creating topic:', error);
            throw error;
        }
    },

    updateTopic: async (id, topicData) => {
        try {
            const formData = new FormData();
            formData.append('title', topicData.title);
            if (topicData.externalLink) {
                formData.append('externalLink', topicData.externalLink);
            }
            if (topicData.video) {
                formData.append('video', topicData.video);
            }
            if (topicData.pdf) {
                formData.append('pdf', topicData.pdf);
            }

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    ...getAuthHeader()
                },
                body: formData
            });
            if (!response.ok) throw new Error('Failed to update topic');
            return await response.json();
        } catch (error) {
            console.error('Error updating topic:', error);
            throw error;
        }
    },

    deleteTopic: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    ...getAuthHeader()
                }
            });
            if (!response.ok) throw new Error('Failed to delete topic');
            return true;
        } catch (error) {
            console.error('Error deleting topic:', error);
            throw error;
        }
    }
};
