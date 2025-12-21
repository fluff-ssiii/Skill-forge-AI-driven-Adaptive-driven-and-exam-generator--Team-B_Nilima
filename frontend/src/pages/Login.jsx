import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'STUDENT'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setApiError('');
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.role) {
            newErrors.role = 'Please select your account type';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setApiError('');

        try {
            const response = await authService.login(formData.email, formData.password);

            // Get user role from response (role is a direct property)
            const userRole = response.role;

            // Verify that the selected role matches the account's actual role
            if (userRole !== formData.role) {
                setApiError(`Invalid credentials. This account is registered as ${userRole}, not ${formData.role}.`);
                setLoading(false);
                return;
            }

            // Redirect based on role
            if (userRole === 'STUDENT') {
                navigate('/student-dashboard');
            } else if (userRole === 'INSTRUCTOR') {
                navigate('/instructor-dashboard');
            } else if (userRole === 'ADMIN') {
                navigate('/admin-dashboard');
            } else {
                // Fallback to generic dashboard
                navigate('/dashboard');
            }
        } catch (error) {
            setApiError(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card">
                <div className="card-header">
                    <h1 className="card-title">Login</h1>
                    <p className="card-subtitle">Sign in to your account</p>
                </div>

                {apiError && (
                    <div className="alert alert-error">
                        {apiError}
                    </div>
                )}

                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <span className="form-error">{errors.email}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                        {errors.password && (
                            <span className="form-error">{errors.password}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="role">Account Type:</label>
                        <select
                            id="role"
                            name="role"
                            className="form-select"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="STUDENT">Student</option>
                            <option value="INSTRUCTOR">Instructor</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                        {errors.role && (
                            <span className="form-error">{errors.role}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>

                <div className="text-center mt-2">
                    <p className="text-secondary">
                        Don't have an account? <Link to="/signup" className="link">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
