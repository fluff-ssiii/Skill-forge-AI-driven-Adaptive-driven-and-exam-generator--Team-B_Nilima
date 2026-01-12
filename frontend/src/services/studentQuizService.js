const BASE = 'http://localhost:8080/api/students';

const getAuthHeader = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

// Resolve a students-table id from a provided id which may be a users-table id (from JWT)
// Strategy (frontend-only):
// 1. Try GET /api/students/{id} — if found, assume id is students id.
// 2. Otherwise fetch /api/students and try to match by userId/email to map to students.id.
// This avoids backend changes and fixes cases where JWT provides users.id but API expects students.id.
const resolveStudentId = async (maybeIdOrUser) => {
    // if caller passed an object (user), try common fields
    let candidate = maybeIdOrUser;
    if (typeof maybeIdOrUser === 'object' && maybeIdOrUser !== null) {
        candidate = maybeIdOrUser.studentId || maybeIdOrUser.id || maybeIdOrUser.userId || maybeIdOrUser.user?.id || maybeIdOrUser.user?.userId;
    }

    // ensure primitive
    if (!candidate) return candidate;

    try {
        // First check cache
        const cacheKey = `resolvedStudent:${candidate}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            console.log('[studentQuizService] using cached resolved student id', cached);
            return cached;
        }

        // try fetching student by candidate id
        const single = await fetch(`${BASE}/${candidate}`, { headers: getAuthHeader() });
        if (single.ok) {
            console.log('[studentQuizService] candidate is valid student id:', candidate);
            localStorage.setItem(cacheKey, String(candidate));
            return candidate;
        }
    } catch (e) {
        // ignore and try list
        console.warn('[studentQuizService] check by id failed, will try listing students', e);
    }

    try {
        const listRes = await fetch(`${BASE}`, { headers: getAuthHeader() });
        if (!listRes.ok) return candidate;
        const students = await listRes.json();
        // try matching by userId or email
        const found = students.find(s => {
            if (!s) return false;
            if (s.userId && String(s.userId) === String(candidate)) return true;
            if (s.id && String(s.id) === String(candidate)) return true;
            if (s.email && String(s.email).toLowerCase() === String(maybeIdOrUser?.email || '').toLowerCase()) return true;
            // sometimes nested user object
            if (s.user && (String(s.user.id) === String(candidate) || String(s.user.userId) === String(candidate))) return true;
            return false;
        });
        if (found) {
            console.log('[studentQuizService] mapped candidate to student id', found.id, 'from', candidate);
            const cacheKey = `resolvedStudent:${candidate}`;
            localStorage.setItem(cacheKey, String(found.id));
            return found.id;
        }
    } catch (e) {
        // fallthrough
    }

    return candidate;
};

export const studentQuizService = {
    generateQuiz: async (studentId, payload) => {
        const resolvedId = await resolveStudentId(studentId);
        const res = await fetch(`${BASE}/${resolvedId}/quizzes`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to generate quiz');
        return res.json();
    },

    submitQuiz: async (studentId, quizId, submission) => {
        const resolvedId = await resolveStudentId(studentId);
        const res = await fetch(`${BASE}/${resolvedId}/quizzes/${quizId}/submit`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(submission)
        });
        if (!res.ok) throw new Error('Failed to submit quiz');
        return res.json();
    },

    getAttempts: async (studentId) => {
        const resolvedId = await resolveStudentId(studentId);
        const res = await fetch(`${BASE}/${resolvedId}/attempts`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to fetch attempts');
        return res.json();
    },

    getProgress: async (studentId) => {
        const resolvedId = await resolveStudentId(studentId);
        const res = await fetch(`${BASE}/${resolvedId}/progress`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to fetch progress');
        return res.json();
    }
};
