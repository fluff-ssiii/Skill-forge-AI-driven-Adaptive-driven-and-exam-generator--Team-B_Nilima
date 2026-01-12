import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { studentService } from '../services/studentService';
import Sidebar from '../components/Sidebar';
import './Profile.css';

function Profile() {
    const user = authService.getCurrentUser();
    const studentId = user?.userId;
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                // Try fetch by studentId (some setups use a separate students table)
                let res = await fetch(`http://localhost:8080/api/students/${studentId}`, { headers: { 'Authorization': `Bearer ${authService.getToken()}` } });
                if (!res.ok) {
                    // fallback: fetch all students and match by email
                    const all = await fetch('http://localhost:8080/api/students', { headers: { 'Authorization': `Bearer ${authService.getToken()}` } }).then(r => r.json());
                    const match = all.find(s => s.email === user?.email || user?.email == null ? null : user.email);
                    if (match) {
                        res = { ok: true, json: async () => match };
                    } else {
                        throw new Error('Profile not found');
                    }
                }
                const data = await res.json();
                setProfile(data);
                setName(data.name || data.fullName || '');
                setEmail(data.email || '');
            } catch (err) {
                console.error(err);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        })();
    }, [studentId]);

    const handleSave = async () => {
        try {
            setLoading(true);
            const updated = { name, email };
            const res = await fetch(`http://localhost:8080/api/students/${studentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authService.getToken()}` },
                body: JSON.stringify(updated)
            });
            if (!res.ok) throw new Error('Failed to update');
            const data = await res.json();
            setProfile(data);
            alert('Profile updated');
        } catch (err) {
            console.error(err);
            setError('Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <div className="profile-page">
                    {loading ? (
                        <div className="profile-loading">Loading...</div>
                    ) : error ? (
                        <div className="profile-error">{error}</div>
                    ) : (
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <div className="avatar-wrap">
                                    <div className="avatar">{(profile?.fullName || name || 'S').charAt(0)}</div>
                                    <button className="avatar-edit" aria-label="Edit avatar" title="Change avatar" onClick={() => { /* UI only */ }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="#fff" strokeWidth="0" fill="#fff" opacity="0.9" /><path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke="#fff" strokeWidth="0" fill="#fff" opacity="0.9" /></svg>
                                    </button>
                                </div>

                                <div className="header-info">
                                    <h2 className="profile-name">{profile?.fullName || name || 'Student'}</h2>
                                    <div className="profile-sub">Student profile</div>
                                    <div className="profile-email">{profile?.email || email}</div>
                                </div>
                            </div>

                            <div className="profile-card-body">
                                <form className="profile-form" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                                    <div className="form-grid">
                                        <div className="form-row">
                                            <label className="form-label" htmlFor="fullName">Full name</label>
                                            <input id="fullName" className="form-input" value={name} onChange={e => setName(e.target.value)} />
                                        </div>

                                        <div className="form-row">
                                            <label className="form-label" htmlFor="email">Email</label>
                                            <input id="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="btn btn-primary" disabled={loading}>Save Changes</button>
                                        <button type="button" className="btn btn-outline" onClick={() => { setName(profile?.name || profile?.fullName || ''); setEmail(profile?.email || ''); }}>Reset</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
