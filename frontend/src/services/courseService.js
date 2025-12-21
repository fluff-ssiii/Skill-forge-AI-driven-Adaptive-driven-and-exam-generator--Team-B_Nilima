const API_URL = 'http://localhost:8080/api/courses';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const courseService = {
    getAllCourses: async () => {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                }
            });
            if (!response.ok) throw new Error('Failed to fetch courses');
            return await response.json();
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    },

    getCoursesByInstructor: async (instructorId) => {
        try {
            const response = await fetch(`${API_URL}/instructor/${instructorId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                }
            });
            if (!response.ok) throw new Error('Failed to fetch instructor courses');
            return await response.json();
        } catch (error) {
            console.error('Error fetching instructor courses:', error);
            throw error;
        }
    },

    createCourse: async (courseData) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(courseData)
            });
            if (!response.ok) throw new Error('Failed to create course');
            return await response.json();
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    },

    updateCourse: async (id, courseData) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(courseData)
            });
            if (!response.ok) throw new Error('Failed to update course');
            return await response.json();
        } catch (error) {
            console.error('Error updating course:', error);
            throw error;
        }
    },

    deleteCourse: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    ...getAuthHeader()
                }
            });
            if (!response.ok) throw new Error('Failed to delete course');
            return true;
        } catch (error) {
            console.error('Error deleting course:', error);
            throw error;
        }
    }
};
